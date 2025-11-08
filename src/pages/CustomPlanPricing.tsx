import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Shield, Clock, X } from "lucide-react";
import Navigation from "@/components/Navigation";

const features = [
  "24/7 AI Voice Receptionist",
  "Automated booking & scheduling",
  "Natural conversation AI (GPT-5 powered)",
  "Dedicated phone number per location",
  "SMS confirmations & reminders",
  "Email notifications included",
  "Calendar integration (Google, Cal.com, etc.)",
  "Real-time availability checking",
  "Multi-location support",
  "Call recording & transcription",
  "Analytics dashboard",
  "No credit card for setup",
  "Free onboarding & training",
  "Cancel anytime",
];

export default function CustomPlanPricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text-static">
            Pricing Built for Your Business
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            We don't believe in one-size-fits-all. That's why we create a customizable plan specifically tailored to your needs.
          </p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/50 glow-primary-strong relative" data-testid="card-custom-plan">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground px-6 py-2 text-sm glow-primary-strong">
                CUSTOMIZABLE PLAN
              </Badge>
            </div>

            <CardHeader className="text-center pt-12 pb-6">
              <CardTitle className="text-3xl md:text-4xl mb-2">
                Customizable Plan
              </CardTitle>
              <CardDescription className="text-lg mb-4">
                Tailored to your business needs
              </CardDescription>
              <CardDescription className="text-base" data-testid="text-starting-price">
                Starting from $97/month • Configure to see your price
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button asChild
                size="lg"
                className="w-full text-lg py-6 glow-primary-strong"
                data-testid="button-configure-plan"
              >
                <Link href="/configure">
                  Configure Your Plan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Free setup assistance</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
