import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface WhoAmIResponse {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  tenant: {
    id: string;
    name: string;
    timezone: string;
  };
  onboardingComplete: boolean;
}

export default function RequireTenant({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [checking, setChecking] = useState(true);
  const [whoami, setWhoami] = useState<WhoAmIResponse | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/portal/whoami", {
          credentials: "include",
        });

        if (!response.ok) {
          setLocation("/login");
          return;
        }

        const data: WhoAmIResponse = await response.json();
        setWhoami(data);

        if (!data.onboardingComplete && !window.location.pathname.startsWith("/portal")) {
          setLocation("/portal");
          return;
        }

        setChecking(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setLocation("/login");
      }
    }

    checkAuth();
  }, [setLocation]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
