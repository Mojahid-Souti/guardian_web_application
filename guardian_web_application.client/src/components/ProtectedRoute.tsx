import { useAuth } from './AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
     children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
     const { isAuthenticated, isLoading } = useAuth();

     useEffect(() => {
          if (!isLoading && !isAuthenticated) {
               window.location.href = 'https://localhost:7024/Auth/Login';
          }
     }, [isAuthenticated, isLoading]);

     if (isLoading) {
          return (
               <div className="flex items-center justify-center min-h-screen">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
          );
     }

     if (!isAuthenticated) {
          return null;
     }

     return <>{children}</>;
};

export default ProtectedRoute;