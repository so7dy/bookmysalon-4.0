import { Card, CardContent } from '@/components/ui/card';
import { Clock, DollarSign, TrendingUp, Shield } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: Clock,
      title: "Never Miss a Booking",
      description: "24/7 availability means customers can book anytime, increasing your revenue potential by up to 40%",
      metric: "+40% Revenue"
    },
    {
      icon: DollarSign,
      title: "Reduce Labor Costs",
      description: "Save thousands monthly on receptionist salaries while providing better service than human staff",
      metric: "Save $3K+/mo"
    },
    {
      icon: TrendingUp,
      title: "Higher Conversion Rates",
      description: "AI never misses details, always books correctly, and converts 85% of calls to appointments",
      metric: "85% Conversion"
    },
    {
      icon: Shield,
      title: "Eliminate No-Shows",
      description: "Automated reminders and confirmations reduce no-shows by 60%, protecting your revenue",
      metric: "-60% No-Shows"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Transform Your Business
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Features tell, but benefits sell. Here's what BookMySalon actually delivers for your salon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover-elevate" data-testid={`card-benefit-${index}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                      <span className="text-sm font-bold text-primary">{benefit.metric}</span>
                    </div>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
