import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Zap, Check } from 'lucide-react';

export default function IntegrationsSection() {
  const integrations = [
    {
      icon: Calendar,
      name: "Calendar Integration",
      description: "Sync with your preferred calendar platform",
      features: [
        "Real-time availability checking",
        "Automatic booking creation",
        "Multi-staff scheduling",
        "Timezone handling"
      ],
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      icon: Phone,
      name: "AI Phone System",
      description: "Natural voice AI with human-like conversations",
      features: [
        "24/7 phone answering",
        "Multi-language support",
        "Custom voice selection",
        "Call transcripts & analytics"
      ],
      color: "from-purple-500/20 to-pink-500/20"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Powerful Integrations
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Seamless Integration with Your Tools
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with any calendar platform and let AI handle your phone calls automatically
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {integrations.map((integration, index) => (
            <Card 
              key={index} 
              className="hover-elevate" 
              data-testid={`card-integration-${integration.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className={`h-2 bg-gradient-to-r ${integration.color} rounded-t-lg`}></div>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <integration.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {integration.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {integration.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="flex items-start gap-3"
                      data-testid={`feature-${integration.name.toLowerCase().replace(/\s+/g, '-')}-${featureIndex}`}
                    >
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <Card className="inline-block bg-primary/5 border-primary/20" data-testid="text-zero-integration-work">
            <CardContent className="p-6">
              <p className="text-sm text-foreground">
                <span className="font-semibold">Zero integration work required.</span> We handle all the complex setup so you can focus on running your salon.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
