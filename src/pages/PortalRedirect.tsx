import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function PortalRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation('/app/overview');
  }, [setLocation]);
  return null;
}
