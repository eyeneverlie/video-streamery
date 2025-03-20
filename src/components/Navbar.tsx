
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname.includes('/admin');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-panel">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 animate-fade-in">
          <Play className="h-6 w-6 text-primary" />
          <span className="text-xl font-medium">StreamHub</span>
        </Link>
        
        <nav className="flex items-center gap-2 md:gap-4 animate-fade-in animation-delay-200">
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm">View Site</Button>
              </Link>
            </>
          ) : (
            <Link to="/admin">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
