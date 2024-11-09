var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const authService = {
    checkAuth: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield fetch('/api/auth/status', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/Auth/Login';
                    return false;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            return data.isAuthenticated;
        }
        catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }),
    logout: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield fetch('/Auth/Logout', {
                method: 'GET',
                credentials: 'include'
            });
            window.location.href = '/Auth/Login';
        }
        catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/Auth/Login';
        }
    })
};
