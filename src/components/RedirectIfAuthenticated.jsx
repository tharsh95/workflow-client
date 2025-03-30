import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while auth is being checked
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if not authenticated
  return children;
};

export default RedirectIfAuthenticated; 