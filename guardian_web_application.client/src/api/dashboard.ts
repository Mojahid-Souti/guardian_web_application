import { PacketEntry, IntrusionTrend, IntrusionType, DashboardStats } from '@/types/dashboard';

const API_BASE_URL = 'https://localhost:7024/api';  // Use the HTTPS URL


const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
     try {
          const response = await fetch(url, {

               ...options,
               credentials: 'include',
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
               const error = await response.text();
               throw new Error(error || `HTTP error! status: ${response.status}`);
          }

          return response.json();
     } catch (error) {
          console.error('API Request failed:', error);
          throw error;
     }
};

export const fetchPackets = async (): Promise<PacketEntry[]> => {
     return fetchWithAuth(`${API_BASE_URL}/intrusiondetection/packets`);
};

export const fetchStats = async (): Promise<DashboardStats> => {
     return fetchWithAuth(`${API_BASE_URL}/intrusiondetection/stats`);
};

export const fetchTrends = async (): Promise<IntrusionTrend[]> => {
     return fetchWithAuth(`${API_BASE_URL}/intrusiondetection/trends`);
};

export const fetchTypes = async (): Promise<IntrusionType[]> => {
     return fetchWithAuth(`${API_BASE_URL}/intrusiondetection/types`);
};

export const ignorePacket = async (id: number): Promise<boolean> => {
     return fetchWithAuth(`${API_BASE_URL}/intrusiondetection/ignore/${id}`, {
          method: 'POST'
     });
};