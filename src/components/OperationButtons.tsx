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
    { icon: Plus, label: 'Push', subtext: 'add', onClick: onPush, color: 'hsl(var(--op-push))' },
    { icon: Trash2, label: 'Pop', subtext: 'remove', onClick: onPop, color: 'hsl(var(--op-pop))' },
    { icon: Eye, label: 'Peek', subtext: 'current', onClick: onPeek, color: 'hsl(var(--op-peek))' },
    { icon: Undo2, label: 'Undo', subtext: 'operation', onClick: onUndo, color: 'hsl(var(--op-undo))', disabled: !canUndo },
    { icon: Redo2, label: 'Redo', subtext: 'operation', onClick: onRedo, color: 'hsl(var(--op-redo))', disabled: !canRedo },
    { icon: List, label: 'Iterate', subtext: 'view all', onClick: onIterate, color: 'hsl(var(--op-iterate))' },
    { icon: RotateCcw, label: 'Reset', subtext: 'clear', onClick: onClear, color: 'hsl(var(--op-clear))' },
  ];

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 justify-center p-4">
      {operations.map((op) => {
        const Icon = op.icon;
        return (
          <Button
            key={op.label}
            onClick={op.onClick}
            disabled={op.disabled}
            className="flex flex-col items-center gap-1 px-3 py-2 h-auto glow-soft transition-all hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${op.color} 0%, ${op.color}dd 100%)`,
              opacity: op.disabled ? 0.5 : 1,
            }}
          >
            <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
            <span className="text-xs font-medium text-white">{op.label}</span>
            <span className="text-[10px] text-white/80">{op.subtext}</span>
          </Button>
        );
      })}
    </div>
  );
};
