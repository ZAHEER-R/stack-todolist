import { useState } from 'react';
import { Calendar, Clock, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { playSound } from '@/lib/sounds';

interface TaskInputProps {
  onAdd: (task: { title: string; description: string; dueDate: string; dueTime: string }) => void;
  onCancel: () => void;
}

export const TaskInput: React.FC<TaskInputProps> = ({ onAdd, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [tempTime, setTempTime] = useState({ hour: '12', minute: '00', period: 'PM' });

  const handleDateOk = () => {
    setDueDate(tempDate);
    setShowDatePicker(false);
    playSound('ok');
  };

  const handleTimeOk = () => {
    const hour = tempTime.period === 'PM' && tempTime.hour !== '12' 
      ? String(parseInt(tempTime.hour) + 12).padStart(2, '0')
      : tempTime.period === 'AM' && tempTime.hour === '12'
      ? '00'
      : tempTime.hour.padStart(2, '0');
    setDueTime(`${hour}:${tempTime.minute}`);
    setShowTimePicker(false);
    playSound('ok');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, description, dueDate, dueTime });
      setTitle('');
      setDescription('');
      setDueDate('');
      setDueTime('');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
      <div className="bg-card p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border-2 border-primary glow-soft">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Add New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description (optional)"
              rows={3}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDatePicker(true)}
              className="flex-1"
            >
              <Calendar className="h-4 w-4 mr-2" />
              {dueDate || 'Select Date'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTimePicker(true)}
              className="flex-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              {dueTime || 'Select Time'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Check className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>

        {showDatePicker && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-card p-6 rounded-lg shadow-2xl">
              <Input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleDateOk} className="w-full">OK</Button>
            </div>
          </div>
        )}

        {showTimePicker && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
            <div className="bg-card p-6 rounded-lg shadow-2xl">
              <div className="flex gap-2 mb-4">
                <select
                  value={tempTime.hour}
                  onChange={(e) => setTempTime({ ...tempTime, hour: e.target.value })}
                  className="p-2 border rounded"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={String(h).padStart(2, '0')}>
                      {String(h).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={tempTime.minute}
                  onChange={(e) => setTempTime({ ...tempTime, minute: e.target.value })}
                  className="p-2 border rounded"
                >
                  {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                    <option key={m} value={String(m).padStart(2, '0')}>
                      {String(m).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <select
                  value={tempTime.period}
                  onChange={(e) => setTempTime({ ...tempTime, period: e.target.value })}
                  className="p-2 border rounded"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <Button onClick={handleTimeOk} className="w-full">OK</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
