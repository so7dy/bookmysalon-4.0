import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest("POST", "/api/contact", formData);

      toast({
        title: "Success!",
        description: "Thank you for contacting us! We'll get back to you soon."
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        business: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation 
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      <main className="pt-20 relative z-10">
        {/* Hero Section */}
        <section className="py-20 overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-static">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Ready to transform your salon with AI? Have questions? We're here to help you get started.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="card-glow border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          required
                          data-testid="input-name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="(555) 123-4567"
                          data-testid="input-phone"
                        />
                      </div>
                      <div>
                        <Label htmlFor="business">Business Name</Label>
                        <Input
                          id="business"
                          name="business"
                          value={formData.business}
                          onChange={handleInputChange}
                          placeholder="Your salon/barbershop name"
                          data-testid="input-business"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your business and how we can help..."
                        rows={5}
                        required
                        data-testid="textarea-message"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full glow-primary" 
                      size="lg"
                      disabled={isSubmitting}
                      data-testid="button-submit-contact"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <Card className="card-glow border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-primary" />
                      Email Us
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <a 
                      href="mailto:hello@bookmysalon.tech"
                      className="text-primary hover:text-primary/80 text-lg font-medium"
                      data-testid="link-email"
                    >
                      hello@bookmysalon.tech
                    </a>
                    <p className="text-muted-foreground mt-2">
                      We typically respond within 4 hours during business hours
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-glow border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary" />
                      Business Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Monday - Friday</span>
                        <span>9:00 AM - 6:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span>10:00 AM - 4:00 PM PST</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span>Closed</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      💬 Live chat available during business hours
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground flex items-center">
                      <HelpCircle className="w-5 h-5 mr-2 text-primary" />
                      Need Quick Answers?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Check out our comprehensive FAQ section on the homepage for instant answers to common questions.
                    </p>
                    <Link href="/#faq">
                      <Button variant="outline" className="w-full" data-testid="button-view-faq">
                        View FAQ Section
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
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