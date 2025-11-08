import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function Privacy() {
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
                <Shield className="w-4 h-4 text-foreground mr-2" />
                <span className="text-sm text-foreground font-medium">Privacy Policy</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-static">
                Privacy Policy
              </h1>
              
              <p className="text-muted-foreground">
                Last updated: September 29, 2025
              </p>
            </div>

            <Card className="card-glow border-border/50">
              <CardContent className="pt-6 space-y-8">
                <div>
                  <CardTitle className="text-xl text-foreground mb-4">1. Information We Collect</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Business name, contact information, and account details</li>
                    <li>Call recordings and transcripts for AI training purposes</li>
                    <li>Appointment booking data and customer information</li>
                    <li>Usage data and analytics from your interactions with our service</li>
                  </ul>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">2. How We Use Your Information</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Provide, maintain, and improve our AI-powered appointment booking service</li>
                    <li>Train and customize AI models to better serve your business</li>
                    <li>Process appointments and communicate with your clients</li>
                    <li>Send you technical notices, updates, and support messages</li>
                    <li>Analyze usage patterns to enhance service quality</li>
                  </ul>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">3. Data Security</CardTitle>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your data, including encryption in transit and at rest, 
                    regular security audits, and strict access controls. All call recordings and sensitive data are stored on secure servers 
                    with enterprise-grade protection.
                  </p>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">4. Data Sharing</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    We do not sell your personal information. We may share your information only:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>With service providers who help us operate our platform</li>
                    <li>When required by law or to protect our legal rights</li>
                    <li>With your explicit consent for specific purposes</li>
                  </ul>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">5. Your Rights</CardTitle>
                  <p className="text-muted-foreground mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Access, update, or delete your personal information</li>
                    <li>Request a copy of your data</li>
                    <li>Opt-out of certain data collection practices</li>
                    <li>Withdraw consent for AI training using your call data</li>
                  </ul>
                </div>

                <div>
                  <CardTitle className="text-xl text-foreground mb-4">6. Contact Us</CardTitle>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
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
