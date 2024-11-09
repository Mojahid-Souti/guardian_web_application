import { NetworkStats, TrafficData, ProtocolDistribution, SecurityPacket } from '@/types/analytics';

const API_BASE_URL = import.meta.env.DEV
     ? 'https://localhost:7024/api'  // Changed to HTTPS and correct port
     : '/api';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
     const response = await fetch(url, {
          ...options,
          credentials: 'include',  // Important for sending cookies
          headers: {
               ...options.headers,
               'Accept': 'application/json',
               'Content-Type': 'application/json',
          }
     });

     if (!response.ok) {
          if (response.status === 401) {
               window.location.href = '/Auth/Login';
               throw new Error('Unauthorized');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
     }
     return response.json();
};

export const fetchAnalyticsStats = async (): Promise<NetworkStats> => {
     return fetchWithAuth(`${API_BASE_URL}/analytics/stats`);
};

export const fetchTrafficData = async (): Promise<TrafficData[]> => {
     return fetchWithAuth(`${API_BASE_URL}/analytics/traffic`);
};

export const fetchProtocolDistribution = async (): Promise<ProtocolDistribution[]> => {
     return fetchWithAuth(`${API_BASE_URL}/analytics/protocols`);
};

export const fetchSecurityPackets = async (): Promise<SecurityPacket[]> => {
     return fetchWithAuth(`${API_BASE_URL}/analytics/packets`);
};

export const fetchPacketDetails = async (id: number): Promise<SecurityPacket> => {
     return fetchWithAuth(`${API_BASE_URL}/analytics/packets/${id}`);
};

export const resolvePacket = async (id: number): Promise<void> => {
     await fetchWithAuth(`${API_BASE_URL}/analytics/packets/${id}/resolve`, {
          method: 'POST'
     });
};