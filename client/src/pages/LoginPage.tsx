import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/Authentication/LoginForm';
import { Helmet } from 'react-helmet';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (isAuthenticated) {
      setLocation('/');
    }
  }, [isAuthenticated, setLocation]);
  
  return (
    <>
      <Helmet>
        <title>Login - ENTNT Ship Maintenance Dashboard</title>
        <meta name="description" content="Log in to access the ENTNT Ship Maintenance Dashboard, a comprehensive system for managing ship maintenance and components." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
        <LoginForm />
      </div>
    </>
  );
};



export default LoginPage;
