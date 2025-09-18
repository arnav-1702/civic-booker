import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationProps {
  userType?: 'user' | 'admin' | null;
  userName?: string;
}

export function Navigation({ userType, userName }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Implement logout logic with Supabase
    navigate('/');
  };

  if (!userType) {
    return (
      <nav className="border-b bg-card shadow-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">GovConnect</span>
            </Link>
            <div className="flex space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b bg-card shadow-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">GovConnect</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            {userType === 'user' && (
              <div className="flex space-x-4">
                <Button 
                  variant={location.pathname === '/offices' ? 'default' : 'ghost'} 
                  asChild
                >
                  <Link to="/offices" className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4" />
                    <span>Offices</span>
                  </Link>
                </Button>
                <Button 
                  variant={location.pathname === '/my-bookings' ? 'default' : 'ghost'} 
                  asChild
                >
                  <Link to="/my-bookings" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </Button>
              </div>
            )}

            {userType === 'admin' && (
              <div className="flex space-x-4">
                <Button 
                  variant={location.pathname === '/admin' ? 'default' : 'ghost'} 
                  asChild
                >
                  <Link to="/admin" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>All Bookings</span>
                  </Link>
                </Button>
                <Button 
                  variant={location.pathname === '/admin/manage' ? 'default' : 'ghost'} 
                  asChild
                >
                  <Link to="/admin/manage" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Manage</span>
                  </Link>
                </Button>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userName ? userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}