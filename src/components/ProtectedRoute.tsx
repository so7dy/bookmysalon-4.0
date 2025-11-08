import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface Organization {
  id: string;
  name: string;
  role: string;
  plan: string;
  minutesUsed: number;
  trialExpiresAt: string | null;
}

interface AuthResponse {
  user: User;
  organizations: Organization[];
  currentOrgId: string;
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (error || !data) {
        setLocation("/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [isLoading, error, data, setLocation]);

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return <>{children}</>;
}
