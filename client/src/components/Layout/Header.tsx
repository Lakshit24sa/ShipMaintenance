import React, { useState } from 'react';
import { MenuIcon, BellIcon, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationsContext';
import NotificationCenter from '../Notifications/NotificationCenter';
import { useTheme } from '@/lib/theme';

interface HeaderProps {
  currentPage: string;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, sidebarOpen, setSidebarOpen }) => {
  const { currentUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
  if (!currentUser) return null;

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white shadow dark:bg-gray-800">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="ml-2 md:ml-0 text-lg font-semibold text-gray-800 dark:text-white capitalize">
            {currentPage}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <button 
            onClick={handleToggleTheme}
            className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
          >
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-1 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <NotificationCenter 
                notifications={notifications}
                markAsRead={markAsRead}
                markAllAsRead={markAllAsRead}
                onClose={() => setNotificationsOpen(false)}
              />
            )}
          </div>
          
          {/* User Menu */}
          <div className="relative">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                <span>{currentUser.name.charAt(0)}</span>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                {currentUser.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
