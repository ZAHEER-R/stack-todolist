import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Layers } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(isSignUp ? 'Account created successfully!' : 'Signed in successfully!');
        navigate('/');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    toast.info('Continuing as guest. Your data will be stored locally.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="animated-border p-1 rounded-xl max-w-md w-full">
        <div className="bg-card p-8 rounded-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="p-3 bg-primary/10 rounded-lg mb-3">
              <Layers className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              Stack Snap Tasks
            </h1>
            <p className="text-muted-foreground text-center">
              Manage your tasks with stack operations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Button>
          </form>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleGuest}
            >
              Continue as Guest (Sign in later)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
