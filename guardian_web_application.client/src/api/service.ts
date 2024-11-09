const API_BASE_URL = import.meta.env.DEV
     ? 'https://localhost:7024/api'  // Changed to HTTPS
     : '/api';

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
     try {
          const response = await fetch(url, {
               ...options,
               credentials: 'include',
               headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...options.headers,
               }
          });

          if (!response.ok) {
               // Handle redirects
               if (response.status === 307) {
                    const newUrl = response.headers.get('Location');
                    if (newUrl) {
                         return fetchWithAuth(newUrl, options);
                    }
               }
               throw new Error(`HTTP error! status: ${response.status}`);
          }

          return response.json();
     } catch (error) {
          console.error('API Request failed:', error);
          throw error;
     }
};

// Analytics API
export const analyticsApi = {
     getStats: () => fetchWithAuth(`${API_BASE_URL}/analytics/stats`),
     getTrafficData: () => fetchWithAuth(`${API_BASE_URL}/analytics/traffic`),
     getProtocolData: () => fetchWithAuth(`${API_BASE_URL}/analytics/protocols`),
     getPackets: () => fetchWithAuth(`${API_BASE_URL}/analytics/packets`),
     resolvePacket: (id: number) => fetchWithAuth(
          `${API_BASE_URL}/analytics/packets/${id}/resolve`,
          { method: 'POST' }
     )
};

// Dashboard API
export const dashboardApi = {
     getPackets: () => fetchWithAuth(`${API_BASE_URL}/intrusiondetection/packets`),
     getStats: () => fetchWithAuth(`${API_BASE_URL}/intrusiondetection/stats`),
     getTrends: () => fetchWithAuth(`${API_BASE_URL}/intrusiondetection/trends`),
     getTypes: () => fetchWithAuth(`${API_BASE_URL}/intrusiondetection/types`),
     ignorePacket: (id: number) => fetchWithAuth(
          `${API_BASE_URL}/intrusiondetection/ignore/${id}`,
          { method: 'POST' }
     )
};