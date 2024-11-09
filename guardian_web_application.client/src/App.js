var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/base/Navbar";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Settings from "./components/Settings";
import { authService } from './components/services/authService';
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    useEffect(() => {
        checkAuth();
    }, []);
    const checkAuth = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const isAuth = yield authService.checkAuth();
            setIsAuthenticated(isAuth);
            if (!isAuth) {
                window.location.href = '/Auth/Login';
            }
        }
        catch (error) {
            console.error('Authentication check failed:', error);
            setIsAuthenticated(false);
            window.location.href = '/Auth/Login';
        }
    });
    if (isAuthenticated === null) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }) }));
    }
    if (!isAuthenticated) {
        return null;
    }
    return (_jsx(Router, { basename: "/app", children: _jsxs("div", { className: "flex", children: [_jsx(Navbar, { onLogout: authService.logout }), _jsx("div", { className: "flex-1 p-7", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, { title: "Home" }) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, { title: "Dashboard" }) }), _jsx(Route, { path: "/analytics", element: _jsx(Analytics, { title: "Analytics" }) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, { title: "Settings" }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }) }));
};
export default App;
