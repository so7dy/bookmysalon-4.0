import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Connect Your Calendar",
      description: "Link your calendar platform in under 2 minutes with our seamless integration",
      duration: "2 min"
    },
    {
      number: "2",
      title: "Configure AI Receptionist",
      description: "Set your services, staff, hours, and customize your AI's voice and personality",
      duration: "5 min"
    },
    {
      number: "3",
      title: "Get Your Phone Number",
      description: "Receive a dedicated toll-free number or forward your existing business line",
      duration: "Instant"
    },
    {
      number: "4",
      title: "Go Live",
      description: "Your AI receptionist starts taking calls, booking appointments, and growing your business",
      duration: "Ready!"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Simple Setup
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            From Signup to First Booking in 10 Minutes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            No technical skills required. Follow these simple steps and start booking more appointments today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative" data-testid={`step-${index}`}>
              <Card className="h-full hover-elevate">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-3">
                      {step.number}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {step.duration}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              
              {/* Arrow between steps (hidden on mobile and last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            Join 500+ salons already using BookMySalon
          </p>
          <Button 
            size="lg"
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-testid="button-get-started"
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
