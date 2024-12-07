import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle email confirmation
  const handleEmailConfirmation = async () => {
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    if (error) {
      toast({
        variant: 'destructive',
        description: errorDescription || 'Error confirming email',
      });
      return;
    }
    
    // If no error, show success message
    if (searchParams.has('access_token')) {
      toast({
        description: 'Email confirmed successfully! You can now sign in.',
      });
    }
  };

  // Check for email confirmation on component mount
  useState(() => {
    handleEmailConfirmation();
  }, []);

  const validateForm = () => {
    if (!email || !password) {
      toast({
        variant: 'destructive',
        description: 'Please fill in all fields',
      });
      return false;
    }
    if (!email.includes('@')) {
      toast({
        variant: 'destructive',
        description: 'Please enter a valid email address',
      });
      return false;
    }
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        description: 'Password must be at least 6 characters long',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (isLogin) {
        await signIn(email, password);
        toast({
          description: 'Successfully logged in!',
        });
      } else {
        // Add the current URL as the redirect URL for email confirmation
        await signUp(email, password);
        toast({
          description: 'Account created successfully! Please check your email for verification.',
        });
      }
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        variant: 'destructive',
        description: errorMessage,
      });
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-100/30 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Welcome back!' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin
              ? 'Sign in to access your account'
              : 'Sign up to get started with our service'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : isLogin ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-800"
            disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;