import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Brain, Clock, TrendingUp, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Phone,
    title: "Smart Call Handling",
    description: "AI automatically answers missed calls and books appointments using natural conversation.",
    highlight: "95% Success Rate"
  },
  {
    icon: Brain,
    title: "Intelligent Scheduling",
    description: "Advanced AI understands your availability and books appointments at optimal times.",
    highlight: "Zero Conflicts"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Never miss another booking opportunity with round-the-clock AI assistant coverage.",
    highlight: "Always Online"
  },
  {
    icon: TrendingUp,
    title: "Revenue Analytics",
    description: "Track missed call recovery and see exactly how much revenue you're gaining back.",
    highlight: "Real-time ROI"
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with full HIPAA compliance for client data protection.",
    highlight: "Bank-level Security"
  },
  {
    icon: Zap,
    title: "Instant Integration",
    description: "Connect with your existing booking system in minutes, not hours or days.",
    highlight: "5-min Setup"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
            <Brain className="w-4 h-4 text-foreground mr-2" />
            <span className="text-sm text-foreground font-medium">Powered by Advanced AI</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Transform Missed Calls Into Revenue
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI doesn't just answer calls—it understands your business, speaks like your team, and converts prospects into booked appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className={`card-glow border-border/50 hover:border-primary/30 transition-all duration-300 fade-in-delay-${index % 3 === 0 ? '1' : index % 3 === 1 ? '2' : '1'}`}
              data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-primary">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground mb-2">{feature.title}</CardTitle>
                <div className="inline-block px-3 py-1 bg-primary/20 rounded-full text-xs text-primary font-semibold">
                  {feature.highlight}
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional CTA Section */}
        <div className="mt-20 text-center">
          <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 max-w-4xl mx-auto">
            <CardContent className="py-12 px-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Stop Losing Money on Missed Calls?
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Join thousands of salons and barbershops already using FutureAI to capture every opportunity.
              </p>
              <div className="text-4xl font-bold text-primary mb-2">
                $19,051
              </div>
              <p className="text-sm text-muted-foreground">
                Average additional monthly revenue per salon
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}