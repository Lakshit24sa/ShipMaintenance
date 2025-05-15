import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please provide both email and password.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = login(email, password);
      
      if (!success) {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold text-primary-900">ENTNT</CardTitle>
        <CardDescription className="text-gray-600">Ship Maintenance Dashboard</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
          
          <div className="text-sm text-center text-gray-500">
            <p>Demo accounts:</p>
            <div className="flex justify-center space-x-4 mt-2">
              <Button
                type="button"
                variant="link"
                className="text-primary-600 hover:text-primary-500 p-0 h-auto"
                onClick={() => setDemoAccount('admin@entnt.in', 'admin123')}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-primary-600 hover:text-primary-500 p-0 h-auto"
                onClick={() => setDemoAccount('inspector@entnt.in', 'inspect123')}
              >
                Inspector
              </Button>
              <Button
                type="button"
                variant="link"
                className="text-primary-600 hover:text-primary-500 p-0 h-auto"
                onClick={() => setDemoAccount('engineer@entnt.in', 'engine123')}
              >
                Engineer
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
