export function openOAuthPopup(startUrl: string, onDone: (ok: boolean) => void) {
  const w = 500, h = 650;
  const y = window.top!.outerHeight / 2 + window.top!.screenY - (h / 2);
  const x = window.top!.outerWidth / 2 + window.top!.screenX - (w / 2);
  const win = window.open(startUrl, 'google_oauth', `width=${w},height=${h},left=${x},top=${y}`);
  
  const handler = (e: MessageEvent) => {
    if (typeof e.data === 'object' && e.data?.type === 'oauth-complete' && e.data?.provider === 'google') {
      window.removeEventListener('message', handler);
      onDone(!!e.data.ok);
      try { 
        win?.close(); 
      } catch {}
    }
  };
  
  window.addEventListener('message', handler);
  
  // Cleanup if popup is closed manually
  const checkClosed = setInterval(() => {
    if (win?.closed) {
      clearInterval(checkClosed);
      window.removeEventListener('message', handler);
    }
  }, 500);
}
