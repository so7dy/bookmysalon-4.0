import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Users,
  Settings as SettingsIcon,
  Plug,
  LogOut,
} from "lucide-react";
import Overview from "./app/Overview";
import Bookings from "./app/Bookings";
import Services from "./app/Services";
import Staff from "./app/Staff";
import Settings from "./app/Settings";
import Integrations from "./app/Integrations";

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
}

export default function AppDashboard() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const { data } = useQuery<WhoAmIResponse>({
    queryKey: ["/portal/whoami"],
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      toast({
        title: "Logged out",
        description: "You've been logged out successfully",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  // Get current section from URL
  const currentSection = location.split("/")[2] || "overview";

  const menuItems = [
    { id: "overview", name: "Overview", icon: LayoutDashboard, path: "/app/overview" },
    { id: "bookings", name: "Bookings", icon: Calendar, path: "/app/bookings" },
    { id: "services", name: "Services", icon: Scissors, path: "/app/services" },
    { id: "staff", name: "Staff", icon: Users, path: "/app/staff" },
    { id: "settings", name: "Settings", icon: SettingsIcon, path: "/app/settings" },
    { id: "integrations", name: "Integrations", icon: Plug, path: "/app/integrations" },
  ];

  const renderContent = () => {
    switch (currentSection) {
      case "overview":
        return <Overview />;
      case "bookings":
        return <Bookings />;
      case "services":
        return <Services />;
      case "staff":
        return <Staff />;
      case "settings":
        return <Settings />;
      case "integrations":
        return <Integrations />;
      default:
        return <Overview />;
    }
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                {data?.tenant?.name || "BookMySalon"}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={currentSection === item.id}
                        data-testid={`nav-${item.id}`}
                      >
                        <Link href={item.path} className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="text-sm text-muted-foreground">
              {data?.user?.fullName || data?.user?.email}
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
