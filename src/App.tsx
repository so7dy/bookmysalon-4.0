import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import RequireTenant from "@/components/RequireTenant";
import Home from "@/pages/Home";
import Contact from "@/pages/Contact";
import ROICalculator from "@/pages/ROICalculator";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import ForBusinesses from "@/pages/ForBusinesses";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import VerifyEmail from "@/pages/VerifyEmail";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Admin from "@/pages/Admin";
import SuperAdmin from "@/pages/SuperAdmin";
import AdminDashboard from "@/pages/AdminDashboard";
import AppDashboard from "@/pages/AppDashboard";
import Onboarding from "@/pages/Onboarding";
import AIOnboarding from "@/pages/AIOnboarding";
import PortalRedirect from "@/pages/PortalRedirect";
import AIReceptionistSetup from "@/pages/AIReceptionistSetup";
import GetStarted from "@/pages/GetStarted";
import ThankYou from "@/pages/ThankYou";
import CustomPlanPricing from "@/pages/CustomPlanPricing";
import CustomPlanConfigure from "@/pages/CustomPlanConfigure";
import CustomPlanThankYou from "@/pages/CustomPlanThankYou";
import LogoPreview from "@/pages/LogoPreview";
import NotFound from "@/pages/not-found";
import GooglePopupComplete from "@/pages/auth/GooglePopupComplete";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Switch>
          {/* Public routes */}
          <Route path="/" component={Home} />
          <Route path="/contact" component={Contact} />
          <Route path="/roi-calculator" component={ROICalculator} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogArticle} />
          <Route path="/businesses" component={ForBusinesses} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          
          {/* Lead generation form */}
          <Route path="/get-started" component={GetStarted} />
          <Route path="/lead-thank-you" component={ThankYou} />
          
          {/* Custom plan pricing and configuration */}
          <Route path="/pricing" component={CustomPlanPricing} />
          <Route path="/configure" component={CustomPlanConfigure} />
          <Route path="/thank-you" component={CustomPlanThankYou} />
          
          {/* Logo preview page */}
          <Route path="/logo-preview" component={LogoPreview} />
          
          {/* Auth routes (tenant-first) */}
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/verify-email" component={VerifyEmail} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          
          {/* Onboarding wizard (legacy) */}
          <Route path="/portal" component={Onboarding} />
          
          {/* AI Receptionist Onboarding (new 7-step flow) */}
          <Route path="/ai-onboarding" component={AIOnboarding} />
          
          {/* Redirect old /onboarding to new /portal */}
          <Route path="/onboarding">
            {() => {
              const [, setLocation] = useLocation();
              useEffect(() => setLocation('/portal'), [setLocation]);
              return null;
            }}
          </Route>
          
          {/* Google OAuth popup complete */}
          <Route path="/auth/google/popup-complete" component={GooglePopupComplete} />
          
          {/* Protected app dashboard routes */}
          <Route path="/app/:rest*">
            <RequireTenant>
              <AppDashboard />
            </RequireTenant>
          </Route>
          
          {/* AI Receptionist Setup (protected) */}
          <Route path="/setup-ai">
            <RequireTenant>
              <AIReceptionistSetup />
            </RequireTenant>
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/old" component={Admin} />
          <Route path="/superadmin" component={SuperAdmin} />
          
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
