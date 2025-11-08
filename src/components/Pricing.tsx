import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Rocket, Sparkles } from "lucide-react";

const customizableFeatures = [
  "Flexible call volume (100-2000+ calls/month)",
  "Adjustable call duration (1-15 minutes)",
  "Multi-location support (1-10+ locations)",
  "SMS confirmations & reminders",
  "Advanced AI conversation",
  "Real-time ROI calculator",
  "Custom appointment types",
  "Priority support",
  "Advanced analytics dashboard",
  "Custom integrations",
  "Dedicated account manager",
  "White-label options available"
];

interface PricingProps {
  onSelectPlan?: (planName: string) => void;
}

export default function Pricing({ onSelectPlan }: PricingProps) {
  return (
    <section id="pricing" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
            <Sparkles className="w-4 h-4 text-foreground mr-2" />
            <span className="text-sm text-foreground font-medium">Simple Pricing</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-static">
            Build Your Perfect Plan
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Every business is unique. Configure your AI assistant to match your exact needs and budget.
          </p>

          <div className="inline-flex items-center px-6 py-3 bg-primary/20 rounded-full border border-primary/30 glow-primary">
            <span className="text-foreground font-semibold">💰 Average ROI: 973% in first month</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Card 
            className="relative card-glow transition-all duration-300 border-primary/50 glow-primary-strong max-w-2xl w-full"
            data-testid="card-pricing-customizable"
          >
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-4 py-1 glow-primary-strong">
                MOST FLEXIBLE
              </Badge>
            </div>

            <CardHeader className="text-center pb-6 pt-8">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-primary">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl text-foreground mb-2">Customizable Plan</CardTitle>
              <CardDescription className="text-muted-foreground text-lg mb-4">
                Tailored to your business needs
              </CardDescription>
              <p className="text-base text-muted-foreground mt-2">
                Starting from $97/month • Configure to see your price
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              <Button asChild
                className="w-full mb-8 glow-primary-strong"
                variant="default"
                size="lg"
                data-testid="button-configure-plan"
              >
                <Link href="/configure">
                  Configure Your Plan
                </Link>
              </Button>

              <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground text-center">
                  ✨ Use our interactive calculator to see real-time pricing and ROI based on your specific needs
                </p>
              </div>

              <ul className="space-y-4">
                {customizableFeatures.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            All plans include free setup, training, and migration assistance
          </p>
          <div className="inline-flex items-center space-x-8 text-sm text-muted-foreground">
            <span>✅ No contracts</span>
            <span>✅ 14-day free trial</span>
            <span>✅ Money-back guarantee</span>
          </div>
        </div>
      </div>
    </section>
  );
}
