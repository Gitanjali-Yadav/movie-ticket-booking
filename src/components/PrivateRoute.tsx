import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Props interface for the PrivateRoute component
 */
interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * PrivateRoute Component
 * 
 * A wrapper component that protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 * 
 * @param {PrivateRouteProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Either the protected content or a redirect to login
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  // Get authentication state from context
  const { user, loading } = useAuth();

  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Render protected content if user is authenticated
  return <>{children}</>;
};

export default PrivateRoute; 