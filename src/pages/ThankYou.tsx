import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Mail, 
  Phone, 
  Calendar,
  Sparkles,
  ArrowRight,
  Home
} from "lucide-react";
import Navigation from "@/components/Navigation";

export default function ThankYou() {
  useEffect(() => {
    // Confetti animation or celebration effect could go here
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Animation */}
          <div className="text-center mb-8 fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 glow-primary">
              <CheckCircle2 className="h-10 w-10 text-primary" data-testid="icon-success" />
            </div>
            
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Application Received
            </Badge>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Thank You!
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We've received your information and are excited to build your custom AI receptionist
            </p>
          </div>

          {/* Main Card */}
          <Card className="border-primary/20 mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                <div className="bg-muted/30 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">What happens next?</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Confirmation Email</h3>
                        <p className="text-sm text-muted-foreground">
                          Check your inbox! We've sent a confirmation with your submission details and next steps.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Team Contact (Within 24 Hours)</h3>
                        <p className="text-sm text-muted-foreground">
                          One of our AI specialists will reach out to discuss your custom setup and answer any questions.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Custom Configuration</h3>
                        <p className="text-sm text-muted-foreground">
                          We'll build your AI agent with your services, voice preferences, and business rules.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-primary">4</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Go Live (48-72 Hours)</h3>
                        <p className="text-sm text-muted-foreground">
                          Your AI receptionist will be live and answering calls 24/7, syncing with your calendar in real-time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">Need immediate assistance?</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email us</p>
                        <a 
                          href="mailto:hello@bookmysalon.tech" 
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                          data-testid="link-email-support"
                        >
                          hello@bookmysalon.tech
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Call us</p>
                        <p className="text-sm font-medium text-foreground">
                          Available 9am-6pm EST
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground mb-1">24/7</p>
                <p className="text-sm text-muted-foreground">AI Coverage</p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground mb-1">48-72h</p>
                <p className="text-sm text-muted-foreground">Setup Time</p>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground mb-1">500+</p>
                <p className="text-sm text-muted-foreground">Happy Salons</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/">
              <Button variant="outline" data-testid="button-back-home">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Link href="/#pricing">
              <Button className="glow-primary" data-testid="button-view-pricing">
                View Pricing Plans
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust Message */}
          <div className="mt-12 text-center">
            <div className="inline-block bg-muted/30 rounded-lg px-6 py-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Privacy First:</span> Your information is secure and will only be used to set up your AI receptionist. We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
