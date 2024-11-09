export const authService = {
     async checkAuth(): Promise<boolean> {
          try {
               const response = await fetch('/api/auth/status', {
                    credentials: 'include',
                    headers: {
                         'Accept': 'application/json'
                    }
               });

               if (!response.ok) {
                    throw new Error('Auth check failed');
               }

               const data = await response.json();
               return data.isAuthenticated;
          } catch (error) {
               console.error('Auth check failed:', error);
               return false;
          }
     },

     async logout(): Promise<void> {
          try {
               const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
               });

               const data = await response.json();

               if (data.success) {
                    // Use the full URL for the backend server
                    window.location.href = 'https://localhost:7024/Auth/Login';
               }
          } catch (error) {
               console.error('Logout failed:', error);
               // Fallback to the backend URL if there's an error
               window.location.href = 'https://localhost:7024/Auth/Login';
          }
     }
};