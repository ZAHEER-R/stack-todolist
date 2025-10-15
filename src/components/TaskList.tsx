import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  completed: boolean;
  stackPosition: number;
}

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (ids: string[]) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onComplete, onDelete }) => {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleLongPressStart = (id: string) => {
    const timer = setTimeout(() => {
      setSelectedTasks((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }, 500);
    setLongPressTimer(timer);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleDeleteSelected = () => {
    onDelete(Array.from(selectedTasks));
    setSelectedTasks(new Set());
  };

  return (
    <div className="space-y-4">
      {selectedTasks.size > 0 && (
        <div className="sticky top-20 z-30 bg-card/90 backdrop-blur-md p-4 rounded-lg border border-border flex justify-between items-center">
          <span className="text-sm font-medium">
            {selectedTasks.size} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      )}

      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={`p-4 bg-card rounded-lg border-2 transition-all hover:shadow-lg ${
            selectedTasks.has(task.id)
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          }`}
          onMouseDown={() => handleLongPressStart(task.id)}
          onMouseUp={handleLongPressEnd}
          onMouseLeave={handleLongPressEnd}
          onTouchStart={() => handleLongPressStart(task.id)}
          onTouchEnd={handleLongPressEnd}
        >
          <div className="flex items-start gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => onComplete(task.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">#{index + 1}</span>
                    <h3 className={`font-semibold ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                  {(task.dueDate || task.dueTime) && (
                    <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                      {task.dueDate && <span>📅 {task.dueDate}</span>}
                      {task.dueTime && <span>🕐 {task.dueTime}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
