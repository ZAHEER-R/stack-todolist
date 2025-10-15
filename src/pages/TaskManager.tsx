import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { OperationButtons } from '@/components/OperationButtons';
import { TaskInput } from '@/components/TaskInput';
import { TaskList, Task } from '@/components/TaskList';
import { Alert } from '@/components/Alert';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LogOut } from 'lucide-react';
import { playSound } from '@/lib/sounds';
import { toast } from 'sonner';

const TaskManager = () => {
  const { user, isGuest, signOut } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [alert, setAlert] = useState<{ message: string; isVictory?: boolean } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'mobile'>('light');

  useEffect(() => {
    if (!user && !isGuest) {
      navigate('/auth');
      return;
    }
    loadTasks();
  }, [user, isGuest, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const loadTasks = async () => {
    if (isGuest) {
      const stored = localStorage.getItem('guestTasks');
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } else if (user) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('stack_position', { ascending: false });
      
      if (!error && data) {
        setTasks(data.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          dueDate: t.due_date || '',
          dueTime: t.due_time || '',
          completed: t.completed || false,
          stackPosition: t.stack_position,
        })));
      }
    }
  };

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks);
    
    if (isGuest) {
      localStorage.setItem('guestTasks', JSON.stringify(newTasks));
    } else if (user) {
      for (const task of newTasks) {
        await supabase.from('tasks').upsert({
          id: task.id,
          user_id: user.id,
          title: task.title,
          description: task.description,
          due_date: task.dueDate || null,
          due_time: task.dueTime || null,
          completed: task.completed,
          stack_position: task.stackPosition,
        });
      }
    }
  };

  const showAlert = (message: string, isVictory = false) => {
    setAlert({ message, isVictory });
  };

  const handlePush = () => {
    setShowInput(true);
  };

  const handleAddTask = async (taskData: { title: string; description: string; dueDate: string; dueTime: string }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      ...taskData,
      completed: false,
      stackPosition: tasks.length,
    };

    const newTasks = [newTask, ...tasks];
    await saveTasks(newTasks);
    setShowInput(false);
    playSound('push');
    showAlert(`Task "${taskData.title}" added to stack.`);
    
    setUndoStack([...undoStack, { type: 'push', task: newTask }]);
    setRedoStack([]);
  };

  const handlePop = async () => {
    if (tasks.length === 0) {
      showAlert('Stack is empty. No task to remove.');
      return;
    }

    const [removedTask, ...remainingTasks] = tasks;
    
    if (isGuest) {
      await saveTasks(remainingTasks);
    } else if (user) {
      await supabase.from('tasks').delete().eq('id', removedTask.id);
      await saveTasks(remainingTasks);
    }

    playSound('pop');
    showAlert(`Task "${removedTask.title}" removed from stack.`);
    setUndoStack([...undoStack, { type: 'pop', task: removedTask }]);
    setRedoStack([]);
  };

  const handlePeek = () => {
    if (tasks.length === 0) {
      showAlert('Stack is empty.');
      return;
    }

    playSound('peek');
    showAlert(`Current task: "${tasks[0].title}"`);
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;

    const lastOp = undoStack[undoStack.length - 1];
    const newUndoStack = undoStack.slice(0, -1);
    setUndoStack(newUndoStack);
    setRedoStack([...redoStack, lastOp]);

    if (lastOp.type === 'push') {
      const newTasks = tasks.filter(t => t.id !== lastOp.task.id);
      if (!isGuest && user) {
        await supabase.from('tasks').delete().eq('id', lastOp.task.id);
      }
      await saveTasks(newTasks);
    } else if (lastOp.type === 'pop') {
      const newTasks = [lastOp.task, ...tasks];
      await saveTasks(newTasks);
    }

    playSound('undo');
    showAlert('Operation undone.');
  };

  const handleRedo = async () => {
    if (redoStack.length === 0) return;

    const lastOp = redoStack[redoStack.length - 1];
    const newRedoStack = redoStack.slice(0, -1);
    setRedoStack(newRedoStack);
    setUndoStack([...undoStack, lastOp]);

    if (lastOp.type === 'push') {
      const newTasks = [lastOp.task, ...tasks];
      await saveTasks(newTasks);
    } else if (lastOp.type === 'pop') {
      const newTasks = tasks.filter(t => t.id !== lastOp.task.id);
      if (!isGuest && user) {
        await supabase.from('tasks').delete().eq('id', lastOp.task.id);
      }
      await saveTasks(newTasks);
    }

    playSound('redo');
    showAlert('Operation redone.');
  };

  const handleIterate = () => {
    playSound('iterate');
    showAlert(`Viewing all ${tasks.length} tasks in stack (top to bottom).`);
  };

  const handleClear = async () => {
    if (!isGuest && user) {
      await supabase.from('tasks').delete().eq('user_id', user.id);
    }
    await saveTasks([]);
    setUndoStack([]);
    setRedoStack([]);
    playSound('clear');
    showAlert('All tasks cleared from stack.');
  };

  const handleComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    if (!isGuest && user) {
      await supabase.from('tasks').delete().eq('id', id);
    }
    
    const newTasks = tasks.filter(t => t.id !== id);
    await saveTasks(newTasks);
    
    playSound('complete');
    showAlert(`Task "${task.title}" completed.`);

    if (newTasks.length === 0) {
      setTimeout(() => {
        playSound('victory');
        showAlert('You completed your tasks today!', true);
      }, 500);
    }
  };

  const handleDelete = async (ids: string[]) => {
    if (!isGuest && user) {
      await supabase.from('tasks').delete().in('id', ids);
    }
    
    const newTasks = tasks.filter(t => !ids.includes(t.id));
    await saveTasks(newTasks);
    playSound('pop');
    showAlert(`${ids.length} task(s) deleted.`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const filteredTasks = tasks.filter(
    task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-1 animated-border"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 animated-border"></div>
        <div className="absolute top-0 bottom-0 left-0 w-1 animated-border"></div>
        <div className="absolute top-0 bottom-0 right-0 w-1 animated-border"></div>
      </div>

      <Header taskCount={tasks.length} theme={theme} onThemeChange={setTheme} />

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <OperationButtons
          onPush={handlePush}
          onPop={handlePop}
          onPeek={handlePeek}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onIterate={handleIterate}
          onClear={handleClear}
          canUndo={undoStack.length > 0}
          canRedo={redoStack.length > 0}
        />

        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {filteredTasks.length > 0 ? (
          <TaskList
            tasks={filteredTasks}
            onComplete={handleComplete}
            onDelete={handleDelete}
          />
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {searchQuery ? 'No tasks match your search.' : 'No tasks yet. Click Push to add one!'}
          </div>
        )}

        <Footer />
      </main>

      {showInput && (
        <TaskInput
          onAdd={handleAddTask}
          onCancel={() => setShowInput(false)}
        />
      )}

      {alert && (
        <Alert
          message={alert.message}
          onClose={() => setAlert(null)}
          isVictory={alert.isVictory}
        />
      )}
    </div>
  );
};

export default TaskManager;
