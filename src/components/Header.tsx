import { Layers, Moon, Sun, Smartphone } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  taskCount: number;
  theme: 'light' | 'dark' | 'mobile';
  onThemeChange: (theme: 'light' | 'dark' | 'mobile') => void;
}

export const Header: React.FC<HeaderProps> = ({ taskCount, theme, onThemeChange }) => {
  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Stack Snap Tasks
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm font-medium px-3 py-1 bg-muted rounded-full">
              {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            </div>
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={theme === 'light' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onThemeChange('light')}
                className="h-8 w-8"
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onThemeChange('dark')}
                className="h-8 w-8"
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === 'mobile' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onThemeChange('mobile')}
                className="h-8 w-8"
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
