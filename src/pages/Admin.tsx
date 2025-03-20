
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { fadeInUp, scaleIn } from '@/utils/animations';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simple demo login - in a real app, this would be a server request
    setTimeout(() => {
      // Demo login - accept any credentials
      setIsLoading(false);
      
      // Store login status in localStorage
      localStorage.setItem('adminLoggedIn', 'true');
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard"
      });
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container flex items-center justify-center px-4 pt-24 pb-16 mx-auto">
        <div className={`max-w-md w-full ${scaleIn()}`}>
          <div className="glass-panel rounded-xl p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-medium">Admin Login</h1>
              <p className="text-muted-foreground mt-1">
                Sign in to access the admin dashboard
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                For demo purposes, any username and password will work
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
