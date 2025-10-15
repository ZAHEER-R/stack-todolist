import React from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface AlertProps {
  message: string;
  onClose: () => void;
  isVictory?: boolean;
}

export const Alert: React.FC<AlertProps> = ({ message, onClose, isVictory }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`bg-card p-6 rounded-lg shadow-2xl max-w-md w-full mx-4 border-2 ${isVictory ? 'border-success' : 'border-primary'} glow-soft`}>
        {isVictory && (
          <div className="text-center mb-4">
            <div className="text-6xl">🏆</div>
          </div>
        )}
        <div className="flex justify-between items-start gap-4">
          <p className="text-foreground flex-1">{message}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
