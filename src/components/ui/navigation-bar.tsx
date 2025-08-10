import React from 'react';
import { ArrowLeft, Menu, Home, Receipt, Package, ChefHat, Settings } from 'lucide-react';
import { Button } from './button';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavigationBarProps {
  title: string;
  showBack?: boolean;
  showMenu?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ 
  title, 
  showBack = false, 
  showMenu = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Receipt, label: 'Receipts', path: '/receipts' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: ChefHat, label: 'Chef Dashboard', path: '/chef' },
    { icon: Settings, label: 'Admin Panel', path: '/admin' },
  ];

  return (
    <div className="h-16 bg-card border-b border-border flex items-center justify-between px-4 shadow-card sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="hover:bg-muted/70"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {showMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border shadow-floating">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <DropdownMenuItem
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`cursor-pointer ${
                    isActive 
                      ? 'bg-primary/10 text-primary font-medium' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/login')}
              className="cursor-pointer hover:bg-muted/50"
            >
              <Settings className="mr-2 h-4 w-4" />
              Login
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};