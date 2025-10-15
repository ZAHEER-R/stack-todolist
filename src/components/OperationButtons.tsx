import { Plus, Trash2, Eye, Undo2, Redo2, List, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';

interface OperationButtonsProps {
  onPush: () => void;
  onPop: () => void;
  onPeek: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onIterate: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const OperationButtons: React.FC<OperationButtonsProps> = ({
  onPush,
  onPop,
  onPeek,
  onUndo,
  onRedo,
  onIterate,
  onClear,
  canUndo,
  canRedo,
}) => {
  const operations = [
    { icon: Plus, label: 'Push', subtext: 'add', onClick: onPush, color: '#E8F5E9' },
    { icon: Trash2, label: 'Pop', subtext: 'remove', onClick: onPop, color: '#FFEBEE' },
    { icon: Eye, label: 'Peek', subtext: 'current', onClick: onPeek, color: '#E3F2FD' },
    { icon: Undo2, label: 'Undo', subtext: 'operation', onClick: onUndo, color: '#FFF3E0', disabled: !canUndo },
    { icon: Redo2, label: 'Redo', subtext: 'operation', onClick: onRedo, color: '#F3E5F5', disabled: !canRedo },
    { icon: List, label: 'Iterate', subtext: 'view all', onClick: onIterate, color: '#E0F2F1' },
    { icon: RotateCcw, label: 'Reset', subtext: 'clear', onClick: onClear, color: '#FFF9C4' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 p-4 max-w-4xl mx-auto">
      {operations.map((op) => {
        const Icon = op.icon;
        return (
          <Button
            key={op.label}
            onClick={op.onClick}
            disabled={op.disabled}
            className="flex flex-col items-center gap-2 px-4 py-4 h-auto glow-soft transition-all hover:scale-105 hover:shadow-lg"
            style={{
              backgroundColor: op.color,
              opacity: op.disabled ? 0.5 : 1,
            }}
          >
            <Icon className="h-6 w-6 md:h-7 md:w-7 text-gray-800 dark:text-white" />
            <span className="text-sm font-semibold text-gray-800 dark:text-white">{op.label}</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">{op.subtext}</span>
          </Button>
        );
      })}
    </div>
  );
};
