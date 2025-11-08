import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import LogoOption1 from "@/components/logos/LogoOption1";
import LogoOption2 from "@/components/logos/LogoOption2";
import LogoOption3 from "@/components/logos/LogoOption3";
import LogoOption4 from "@/components/logos/LogoOption4";
import LogoOption5 from "@/components/logos/LogoOption5";
import { useTheme } from "@/components/ThemeProvider";

export default function LogoPreview() {
  const [selectedLogo, setSelectedLogo] = useState<number | null>(null);
  const { theme } = useTheme();

  const logos = [
    {
      id: 1,
      name: "Tech Scissors",
      description: "Modern AI circuit design with scissors, showing both salon services and technology integration",
      component: LogoOption1,
      features: ["AI neural network visual", "Salon scissors icon", "Tech-forward aesthetic"]
    },
    {
      id: 2,
      name: "Phone + Calendar",
      description: "Directly represents AI phone receptionist and booking functionality",
      component: LogoOption2,
      features: ["Phone handset icon", "Calendar integration", "Clear service message"]
    },
    {
      id: 3,
      name: "Minimalist Geometric",
      description: "Clean, Apple-style design with abstract B+S letterform",
      component: LogoOption3,
      features: ["Premium minimal look", "Letter-based design", "Professional & modern"]
    },
    {
      id: 4,
      name: "Salon Chair",
      description: "Industry-specific salon chair with AI tech accents",
      component: LogoOption4,
      features: ["Recognizable salon icon", "Tech overlay effects", "Industry-focused"]
    },
    {
      id: 5,
      name: "Chat + Scissors",
      description: "Friendly conversation bubble containing scissors, representing AI chat + salon",
      component: LogoOption5,
      features: ["Approachable design", "Conversational AI visual", "Friendly & modern"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-page-title">
            Choose Your Logo
          </h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Select the design that best represents BookMySalon. All logos work perfectly in light and dark modes.
          </p>
        </div>
      </div>

      {/* Logo Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {logos.map((logo) => {
            const LogoComponent = logo.component;
            const isSelected = selectedLogo === logo.id;
            
            return (
              <Card 
                key={logo.id}
                className={`relative transition-all ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                    : 'hover-elevate'
                }`}
                data-testid={`card-logo-option-${logo.id}`}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-primary text-primary-foreground gap-1 px-3 py-1">
                      <Check className="w-3 h-3" />
                      Selected
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {logo.name}
                    <span className="text-sm font-normal text-muted-foreground">
                      Option {logo.id}
                    </span>
                  </CardTitle>
                  <CardDescription>{logo.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Logo Preview - Light Background */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Light Mode
                    </div>
                    <div className="bg-white dark:bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[120px]">
                      <div className="text-black">
                        <LogoComponent />
                      </div>
                    </div>
                  </div>

                  {/* Logo Preview - Dark Background */}
                  <div className="space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Dark Mode
                    </div>
                    <div className="bg-gray-900 dark:bg-black rounded-lg p-8 flex items-center justify-center min-h-[120px]">
                      <div className="text-white">
                        <LogoComponent />
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Features
                    </div>
                    <ul className="space-y-1">
                      {logo.features.map((feature, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Select Button */}
                  <Button
                    className="w-full"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => setSelectedLogo(logo.id)}
                    data-testid={`button-select-logo-${logo.id}`}
                  >
                    {isSelected ? "Selected" : "Select This Logo"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        {selectedLogo && (
          <div className="mt-12 p-6 bg-card rounded-lg border border-border text-center space-y-4">
            <h3 className="text-xl font-semibold">
              Great choice! You selected Option {selectedLogo}: {logos.find(l => l.id === selectedLogo)?.name}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let me know which logo you'd like to use, and I'll update your website with it!
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button 
                size="lg" 
                className="glow-primary"
                data-testid="button-confirm-selection"
              >
                Confirm & Apply Logo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setSelectedLogo(null)}
                data-testid="button-reset-selection"
              >
                Choose Different Option
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
