import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNavigation from './MobileNavigation';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation, useRoute } from 'wouter';

interface AppLayoutProps {
  children: React.ReactNode;
}


const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const [isMatchingRoute] = useRoute('/login');
  
  // If user is not authenticated or on login page, just render children
  if (!isAuthenticated || isMatchingRoute) {
    return <>{children}</>;
  }
  
  // Extract the current page from the location
  const currentPage = location === '/' ? 'dashboard' : location.replace('/', '');
  
  return (
    <div className="h-screen flex flex-col">
      <div className="h-screen flex overflow-hidden">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            currentPage={currentPage}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
          
          <main className="flex-1 overflow-auto bg-gray-50 p-4">
            {children}
          </main>
          
          <MobileNavigation currentPage={currentPage} />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
