import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Layers, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isPhoneVerification, setIsPhoneVerification] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, continueAsGuest, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) {
      toast.error('Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsPhoneVerification(true);
        toast.success('OTP sent to your phone number!');
      }
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First verify the OTP
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: phone,
        token: otp,
        type: 'sms',
      });

      if (verifyError) {
        toast.error(verifyError.message);
        setLoading(false);
        return;
      }

      // Then create the account with email/password
      const { error: signUpError } = await signUp(email, password, name, phone);

      if (signUpError) {
        toast.error(signUpError.message);
      } else {
        toast.success('Account created successfully with verified phone!');
        navigate('/');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If signing up and haven't verified phone yet, send OTP first
    if (isSignUp && !isPhoneVerification) {
      handleSendOTP(e);
      return;
    }

    // If in phone verification mode, verify and sign up
    if (isSignUp && isPhoneVerification) {
      handleVerifyAndSignUp(e);
      return;
    }

    setLoading(true);

    try {
      if (isForgotPassword) {
        const { error } = await resetPassword(email);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Password reset email sent! Check your inbox.');
          setIsForgotPassword(false);
          setEmail('');
        }
      } else {
        const { error } = await signIn(email, password);

        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Signed in successfully!');
          navigate('/');
        }
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
              Stack To-Do List
            </h1>
            <p className="text-muted-foreground text-center">
              {isForgotPassword 
                ? 'Reset your password' 
                : isPhoneVerification 
                ? 'Verify your phone number'
                : 'Manage your tasks with stack operations'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-4">
            {isPhoneVerification ? (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Enter OTP</label>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="w-full justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>
              </>
            ) : (
              <>
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      required
                    />
                  </div>
                )}
                
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1234567890"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Include country code (e.g., +1 for US, +91 for India)
                    </p>
                  </div>
                )}
                
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

                {!isForgotPassword && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading || (isPhoneVerification && otp.length !== 6)}>
              {loading 
                ? 'Loading...' 
                : isForgotPassword 
                ? 'Send Reset Email' 
                : isPhoneVerification
                ? 'Verify & Create Account'
                : isSignUp 
                ? 'Send OTP' 
                : 'Sign In'}
            </Button>
          </form>

          <div className="space-y-3">
            {isPhoneVerification && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsPhoneVerification(false);
                  setOtp('');
                }}
              >
                Back to Sign Up
              </Button>
            )}

            {!isForgotPassword && !isPhoneVerification && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setIsPhoneVerification(false);
                    setOtp('');
                  }}
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
              </>
            )}

            {!isPhoneVerification && (
              <Button
                type="button"
                variant="ghost"
                className="w-full text-sm"
                onClick={() => {
                  setIsForgotPassword(!isForgotPassword);
                  setPassword('');
                  setIsPhoneVerification(false);
                }}
              >
                {isForgotPassword ? 'Back to Sign In' : 'Forgot Password?'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
