import { useEffect } from 'react';

export default function GooglePopupComplete() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage(
        { type: 'oauth-complete', provider: 'google', ok: true },
        '*'
      );
    }
    setTimeout(() => window.close(), 300);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-xl font-semibold mb-2">Connected!</h1>
        <p className="text-muted-foreground">You can close this window.</p>
      </div>
    </div>
  );
}
