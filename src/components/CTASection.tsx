import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Limited Time Offer</span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
          Ready to Transform Your Salon?
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join 500+ salons using AI to book more appointments, reduce costs, and never miss a customer call again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg"
            onClick={() => {
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-testid="button-cta-start"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => {
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
            }}
            data-testid="button-cta-demo"
          >
            Hear a Demo Call
          </Button>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2" data-testid="text-no-credit-card">
            <Check className="h-5 w-5 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2" data-testid="text-quick-setup">
            <Check className="h-5 w-5 text-green-500" />
            <span>Setup in 10 minutes</span>
          </div>
          <div className="flex items-center gap-2" data-testid="text-cancel-anytime">
            <Check className="h-5 w-5 text-green-500" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
