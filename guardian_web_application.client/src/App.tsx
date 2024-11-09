import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/base/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import { authService } from '@/components/services/authService';

const App = () => {
     const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          const checkAuth = async () => {
               try {
                    const isAuth = await authService.checkAuth();
                    setIsAuthenticated(isAuth);
                    setIsLoading(false);

                    if (!isAuth) {
                         window.location.href = '/Auth/Login';
                    }
               } catch (error) {
                    console.error('Authentication check failed:', error);
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    window.location.href = '/Auth/Login';
               }
          };

          checkAuth();
     }, []);

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

     return (
          <BrowserRouter>
               <div className="flex">
                    <Navbar onLogout={authService.logout} />
                    <div className="flex-1">
                         <Routes>
                              <Route path="/" element={<Home title="Home" />} />
                              <Route path="/dashboard" element={<Dashboard title="Dashboard" />} />
                              <Route path="/analytics" element={<Analytics title="Analytics" />} />
                              <Route path="/settings" element={<Settings title="Settings" />} />
                              <Route path="*" element={<Navigate to="/" replace />} />
                         </Routes>
                    </div>
               </div>
          </BrowserRouter>
     );
};

export default App;