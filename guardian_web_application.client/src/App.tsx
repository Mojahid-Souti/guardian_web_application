import { useState } from "react";
import Navbar from "@/components/base/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/base/Login";
import Register from "./components/base/Register";

const App = () => {
     const [isAuthenticated, setIsAuthenticated] = useState(false); // Manage auth state here
     const [selectedPage, setSelectedPage] = useState("Home");

     return (
          <BrowserRouter>
               <div className="flex">
                    {isAuthenticated && (
                         <Navbar selectedPage={selectedPage} onSelectPage={setSelectedPage} />
                    )}
                    <div className="flex-grow">
                         <Routes>
                              <Route
                                   path="/login"
                                   element={
                                        isAuthenticated ? <Navigate to="/" /> : <Login setAuth={setIsAuthenticated} />
                                   }
                              />
                              <Route
                                   path="/register"
                                   element={
                                        isAuthenticated ? <Navigate to="/" /> : <Register setAuth={setIsAuthenticated} />
                                   }
                              />
                              {isAuthenticated ? (
                                   <>
                                        <Route path="/dashboard" element={<Dashboard title="Dashboard" />} />
                                        <Route path="/analytics" element={<Analytics title="Analytics" />} />
                                        <Route path="/settings" element={<Settings title="Settings" />} />
                                        <Route path="/" element={<Home title="Home" />} />
                                   </>
                              ) : (
                                   <Route path="*" element={<Navigate to="/login" />} />
                              )}
                         </Routes>
                    </div>
               </div>
          </BrowserRouter>
     );
};

export default App;
