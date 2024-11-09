var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { authService } from '@/components/services/authService';
const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const checkAuth = () => __awaiter(void 0, void 0, void 0, function* () {
            const isAuth = yield authService.checkAuth();
            setIsAuthenticated(isAuth);
            setIsLoading(false);
        });
        checkAuth();
    }, []);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }) }));
    }
    if (!isAuthenticated) {
        return null; // Will be redirected by checkAuth
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
