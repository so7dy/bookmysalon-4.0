import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Terms() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div>
        <Navigation 
          isLoggedIn={isLoggedIn}
          onLogin={() => setIsLoggedIn(true)}
          onLogout={() => setIsLoggedIn(false)}
        />
      </div>

      <main className="pt-20 relative">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
                <FileText className="w-4 h-4 text-foreground mr-2" />
                <span className="text-sm text-foreground font-medium">Terms of Service</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-static">
                Terms of Service
              </h1>
              
              <p className="text-muted-foreground">
                Last updated: September 29, 2025
              </p>
            </div>

            <Card className="card-glow border-border/50">
              <CardContent className="pt-6 space-y-8">
                <div>
                  <CardTitle className="text-xl text-foreground mb-4">1. Acceptance of Terms</CardTitle>
                  <p className="text-muted-foreground">
                    By accessing and using BookMySalon's AI-powered appointment booking service, you accept and agree to be bound by 
                    these Terms of Service. If you do not agree to these terms, please do not use our service.
                  </p>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">2. Service Description</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    BookMySalon provides an AI-powered virtual assistant service that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Answers missed calls for salon and barbershop businesses</li>
                    <li>Books appointments automatically using conversational AI</li>
                    <li>Integrates with your existing booking systems</li>
                    <li>Provides analytics and reporting on call performance</li>
                  </ul>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">3. User Responsibilities</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    As a user of our service, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Provide accurate business information and maintain account security</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Use the service only for lawful business purposes</li>
                    <li>Not attempt to reverse engineer or compromise our AI systems</li>
                    <li>Inform your customers that calls may be handled by AI technology</li>
                  </ul>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">4. Subscription and Billing</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    Our service is offered on a subscription basis:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>All plans include a 14-day free trial period</li>
                    <li>Subscriptions automatically renew unless cancelled</li>
                    <li>Fees are billed in advance on a monthly or annual basis</li>
                    <li>Refunds are provided only in accordance with our refund policy</li>
                    <li>We reserve the right to change pricing with 30 days notice</li>
                  </ul>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">5. Service Level and Availability</CardTitle>
                  <p className="text-muted-foreground">
                    We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. The AI system's accuracy and 
                    performance may vary based on call quality, customer speech patterns, and other factors. We continuously improve 
                    our AI models but cannot guarantee perfect performance in all scenarios.
                  </p>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">6. Intellectual Property</CardTitle>
                  <p className="text-muted-foreground">
                    All AI technology, software, content, and materials provided through our service remain the property of BookMySalon. 
                    You retain ownership of your business data and customer information, granting us only the necessary licenses to 
                    provide the service.
                  </p>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">7. Limitation of Liability</CardTitle>
                  <p className="text-muted-foreground">
                    BookMySalon shall not be liable for any indirect, incidental, special, or consequential damages arising from your 
                    use of the service, including but not limited to lost revenue, missed appointments, or business interruption. 
                    Our total liability is limited to the fees paid in the preceding 12 months.
                  </p>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">8. Termination</CardTitle>
                  <p className="text-muted-foreground">
                    Either party may terminate the service agreement with 30 days written notice. We reserve the right to immediately 
                    suspend or terminate service for violations of these terms, non-payment, or illegal activities.
                  </p>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">9. Changes to Terms</CardTitle>
                  <p className="text-muted-foreground">
                    We may modify these Terms of Service from time to time. Continued use of the service after changes are posted 
                    constitutes acceptance of the updated terms. Significant changes will be communicated via email.
                  </p>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">10. Contact Information</CardTitle>
                  <p className="text-muted-foreground">
                    For questions about these Terms of Service, please contact us at{" "}
                    <a href="mailto:hello@bookmysalon.tech" className="text-primary hover:text-primary/80">
                      hello@bookmysalon.tech
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2 order-3 md:order-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xl font-bold text-foreground font-mono">BookMySalon</span>
                <img src="/logo.svg" alt="BookMySalon Logo" className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Transform your salon or barbershop with AI-powered call handling that never misses an opportunity.
              </p>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>
                  <strong>Luna Setter LLC</strong>
                </div>
                <div>
                  30 N Gould St Ste R<br />
                  Sheridan, WY 82801
                </div>
                <div>
                  Founders: Omar Ihahane/Yahya El Idrissi
                </div>
                <div className="pt-2">
                  © 2025 BookMySalon. All rights reserved.
                </div>
                <div>
                  Contact us: <a href="mailto:hello@bookmysalon.tech" className="text-primary hover:text-primary/80">hello@bookmysalon.tech</a>
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="/#roi-calculator" className="hover:text-primary transition-colors">ROI Calculator</a></li>
                <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="/#demo" className="hover:text-primary transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div className="order-2 md:order-3">
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="/privacy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
