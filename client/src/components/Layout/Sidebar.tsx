import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import {
  ShipIcon,
  LayoutDashboardIcon,
  Drill,
  WrenchIcon,
  CalendarIcon,
  LogOutIcon
} from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen, currentPage }) => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <div className={`md:flex flex-col fixed inset-y-0 md:relative z-10 ${sidebarOpen ? 'flex' : 'hidden'}`}>
      {/* Mobile sidebar backdrop */}
      <div 
        onClick={() => setSidebarOpen(false)} 
        className="fixed inset-0 bg-gray-600 bg-opacity-75 md:hidden"
      ></div>
      
      {/* Sidebar */}
      <div className="flex flex-col flex-grow bg-primary-900 w-64 md:relative z-10">
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-800">
          <h1 className="text-lg font-bold text-white">ENTNT</h1>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-white"
          >
            <span className="sr-only">Close sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex flex-col flex-grow overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link 
              href="/"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                currentPage === 'dashboard' 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-800'
              }`}
            >
              <LayoutDashboardIcon className={`mr-3 h-5 w-5 ${
                currentPage === 'dashboard' ? 'text-white' : 'text-primary-300'
              }`} />
              Dashboard
            </Link>
            
            <Link 
              href="/ships"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                currentPage === 'ships' 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-800'
              }`}
            >
              <ShipIcon className={`mr-3 h-5 w-5 ${
                currentPage === 'ships' ? 'text-white' : 'text-primary-300'
              }`} />
              Ships
            </Link>
            
            <Link 
              href="/components"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                currentPage === 'components' 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-800'
              }`}
            >
              <Drill className={`mr-3 h-5 w-5 ${
                currentPage === 'components' ? 'text-white' : 'text-primary-300'
              }`} />
              Components
            </Link>
            
            <Link 
              href="/jobs"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                currentPage === 'jobs' 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-800'
              }`}
            >
              <WrenchIcon className={`mr-3 h-5 w-5 ${
                currentPage === 'jobs' ? 'text-white' : 'text-primary-300'
              }`} />
              Maintenance Jobs
            </Link>
            
            <Link 
              href="/calendar"
              onClick={() => setSidebarOpen(false)}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                currentPage === 'calendar' 
                  ? 'bg-primary-800 text-white' 
                  : 'text-primary-100 hover:bg-primary-800'
              }`}
            >
              <CalendarIcon className={`mr-3 h-5 w-5 ${
                currentPage === 'calendar' ? 'text-white' : 'text-primary-300'
              }`} />
              Calendar
            </Link>
          </nav>
        </div>
        
        <div className="p-4 border-t border-primary-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-white">
                <span>{currentUser.name.charAt(0)}</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-primary-300">{currentUser.role}</p>
            </div>
          </div>
          <div className="mt-3">
            <button 
              onClick={logout}
              className="w-full flex items-center justify-center px-4 py-2 text-sm text-white bg-primary-800 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <LogOutIcon className="mr-2 h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
