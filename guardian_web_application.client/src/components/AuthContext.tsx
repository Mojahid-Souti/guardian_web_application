import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './services/authService';
import { AUTH_CONSTANTS } from './services/authConstants';

interface AuthContextType {
     isAuthenticated: boolean;
     isLoading: boolean;
     logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
     isAuthenticated: false,
     isLoading: true,
     logout: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
     const [isAuthenticated, setIsAuthenticated] = useState(false);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          const checkAuth = async () => {
               try {
                    const isAuth = await authService.checkAuth();
                    setIsAuthenticated(isAuth);
                    setIsLoading(false);

                    if (!isAuth) {
                         window.location.href = AUTH_CONSTANTS.LOGIN_URL;
                    }
               } catch (error) {
                    console.error('Auth check failed:', error);
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    window.location.href = AUTH_CONSTANTS.LOGIN_URL;
               }
          };

          checkAuth();
     }, []);

     const logout = async () => {
          await authService.logout();
          setIsAuthenticated(false);
     };

     return (
          <AuthContext.Provider value={{ isAuthenticated, isLoading, logout }}>
               {children}
          </AuthContext.Provider>
     );
};

export const useAuth = () => useContext(AuthContext);