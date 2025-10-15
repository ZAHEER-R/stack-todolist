import { Layers, Moon, Sun, Smartphone, User, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface HeaderProps {
  taskCount: number;
  theme: 'light' | 'dark' | 'mobile';
  onThemeChange: (theme: 'light' | 'dark' | 'mobile') => void;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
}

export const Header: React.FC<HeaderProps> = ({ taskCount, theme, onThemeChange, userEmail, userName, userPhone }) => {
  const [showAccountInfo, setShowAccountInfo] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-base md:text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent whitespace-nowrap">
              Stack To-Do List
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
            {(userEmail || userName) && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAccountInfo(!showAccountInfo)}
                  className="h-8 w-8"
                >
                  <User className="h-4 w-4" />
                </Button>
                {showAccountInfo && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-sm">Account Information</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAccountInfo(false)}
                        className="h-6 w-6 -mt-1 -mr-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {userName && (
                      <div className="mb-2">
                        <span className="text-xs text-muted-foreground">Name</span>
                        <p className="text-sm font-medium">{userName}</p>
                      </div>
                    )}
                    {userEmail && (
                      <div className="mb-2">
                        <span className="text-xs text-muted-foreground">Email</span>
                        <p className="text-sm font-medium break-all">{userEmail}</p>
                      </div>
                    )}
                    {userPhone && (
                      <div>
                        <span className="text-xs text-muted-foreground">Phone</span>
                        <p className="text-sm font-medium">{userPhone}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
