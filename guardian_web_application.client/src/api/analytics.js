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
export const fetchAnalyticsStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_BASE_URL}/analytics/stats`);
    if (!response.ok)
        throw new Error('Failed to fetch analytics stats');
    return response.json();
});
export const fetchTrafficData = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_BASE_URL}/analytics/traffic`);
    if (!response.ok)
        throw new Error('Failed to fetch traffic data');
    return response.json();
});
export const fetchProtocolDistribution = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_BASE_URL}/analytics/protocols`);
    if (!response.ok)
        throw new Error('Failed to fetch protocol distribution');
    return response.json();
});
export const fetchSecurityPackets = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_BASE_URL}/analytics/packets`);
    if (!response.ok)
        throw new Error('Failed to fetch security packets');
    return response.json();
});
export const fetchPacketDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_BASE_URL}/analytics/packets/${id}`);
    if (!response.ok)
        throw new Error('Failed to fetch packet details');
    return response.json();
});
export const resolvePacket = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${API_BASE_URL}/analytics/packets/${id}/resolve`, {
        method: 'POST'
    });
    if (!response.ok)
        throw new Error('Failed to resolve packet');
});
