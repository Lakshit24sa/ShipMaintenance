import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getCurrentUser, setCurrentUser, getUserByEmail, getUsers, initializeLocalStorage } from '../utils/localStorage';
import { useLocation } from 'wouter';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (allowedRoles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [, setLocation] = useLocation();

  // Initialize local storage with default data if needed
  useEffect(() => {
    initializeLocalStorage();
    
    // Check if user is already logged in (from localStorage)
    const user = getCurrentUser();
    if (user) {
      setUserState(user);
      setIsAuthenticated(true);
    } else {
      setLocation('/login');
    }
  }, [setLocation]);

  const login = (email: string, password: string): boolean => {
    const user = getUserByEmail(email);
    
    if (user && user.password === password) {
      setUserState(user);
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLocation('/');
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUserState(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setLocation('/login');
  };

  const hasPermission = (allowedRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return allowedRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      login, 
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
