import { apiRequest, queryClient } from './queryClient';

export interface GoogleConnectOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

/**
 * Opens Google OAuth popup and handles the connection flow
 */
export async function openGoogleConnect(options?: GoogleConnectOptions) {
  try {
    // Get OAuth URL from server
    const response = await fetch('/oauth/google/start', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to start OAuth flow');
    }
    
    const { url } = await response.json();
    
    // Open popup
    const popup = window.open(url, 'google_oauth', 'width=520,height=640');
    
    if (!popup) {
      throw new Error('Failed to open popup. Please allow popups for this site.');
    }
    
    // Listen for success message
    const messageHandler = async (event: MessageEvent) => {
      if (event.data?.type === 'oauth:success') {
        window.removeEventListener('message', messageHandler);
        popup.close();
        
        try {
          // Reconcile pending staff calendars
          await apiRequest('POST', '/staff/calendars/reconcile', {});
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['/auth/google/status'] });
          queryClient.invalidateQueries({ queryKey: ['/staff/calendars'] });
          
          options?.onSuccess?.();
        } catch (error) {
          console.error('Post-OAuth reconciliation failed:', error);
          options?.onError?.(error);
        }
      }
    };
    
    window.addEventListener('message', messageHandler);
    
    // Cleanup if popup is closed without completing
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
      }
    }, 500);
  } catch (error) {
    console.error('Google connect error:', error);
    options?.onError?.(error);
    throw error;
  }
}
