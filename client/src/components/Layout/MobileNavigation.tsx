import React from 'react';
import { Link } from 'wouter';
import {
  ShipIcon,
  LayoutDashboardIcon,
  Drill,
  WrenchIcon,
  CalendarIcon,
} from 'lucide-react';

interface MobileNavigationProps {
  currentPage: string;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ currentPage }) => {
  return (
    <div className="sm:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-around">
        <Link 
          href="/"
          className={`flex flex-col items-center justify-center p-2 flex-1 ${
            currentPage === 'dashboard' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <LayoutDashboardIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        
        <Link 
          href="/ships"
          className={`flex flex-col items-center justify-center p-2 flex-1 ${
            currentPage === 'ships' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <ShipIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Ships</span>
        </Link>
        
        <Link 
          href="/components"
          className={`flex flex-col items-center justify-center p-2 flex-1 ${
            currentPage === 'components' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <Drill className="h-5 w-5" />
          <span className="text-xs mt-1">Components</span>
        </Link>
        
        <Link 
          href="/jobs"
          className={`flex flex-col items-center justify-center p-2 flex-1 ${
            currentPage === 'jobs' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <WrenchIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Jobs</span>
        </Link>
        
        <Link 
          href="/calendar"
          className={`flex flex-col items-center justify-center p-2 flex-1 ${
            currentPage === 'calendar' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <CalendarIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Calendar</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavigation;
