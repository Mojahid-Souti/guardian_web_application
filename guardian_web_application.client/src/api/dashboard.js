var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_BASE_URL = import.meta.env.DEV
    ? 'http://localhost:5264/api'
    : '/api';
// Helper function to handle API responses
const handleResponse = (response) => __awaiter(void 0, void 0, void 0, function* () {
    if (!response.ok) {
        const error = yield response.text();
        throw new Error(error || 'Network response was not ok');
    }
    return response.json();
});
export const fetchPackets = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_BASE_URL}/intrusiondetection/packets`);
        return handleResponse(response);
    }
    catch (error) {
        console.error('Error fetching packets:', error);
        throw error;
    }
});
export const fetchStats = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_BASE_URL}/intrusiondetection/stats`);
        return handleResponse(response);
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        throw error;
    }
});
export const fetchTrends = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_BASE_URL}/intrusiondetection/trends`);
        return handleResponse(response);
    }
    catch (error) {
        console.error('Error fetching trends:', error);
        throw error;
    }
});
export const fetchTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_BASE_URL}/intrusiondetection/types`);
        return handleResponse(response);
    }
    catch (error) {
        console.error('Error fetching types:', error);
        throw error;
    }
});
export const ignorePacket = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(`${API_BASE_URL}/intrusiondetection/ignore/${id}`, {
            method: 'POST'
        });
        return handleResponse(response);
    }
    catch (error) {
        console.error('Error ignoring packet:', error);
        throw error;
    }
});
