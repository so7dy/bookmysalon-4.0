import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, TrendingUp, Users, Zap, CheckCircle, Star, ArrowRight, Scissors, Sparkles, Heart, Palette } from "lucide-react";
import { Link } from "wouter";

const businessTypes = [
  {
    name: "Hair Salons",
    icon: Palette,
    description: "Full-service salons offering cuts, colors, and styling",
    benefits: ["Handle peak booking times", "Manage complex color appointments", "Upsell treatments automatically"],
    avgIncrease: "+35%"
  },
  {
    name: "Barbershops", 
    icon: Scissors,
    description: "Traditional and modern barbershops",
    benefits: ["Quick appointment booking", "Handle walk-in inquiries", "Manage recurring clients"],
    avgIncrease: "+28%"
  },
  {
    name: "Day Spas",
    icon: Heart, 
    description: "Full-service spas and wellness centers",
    benefits: ["Complex package bookings", "Multi-service appointments", "VIP client management"],
    avgIncrease: "+42%"
  },
  {
    name: "Nail Salons",
    icon: Sparkles,
    description: "Nail art, manicures, and pedicures",
    benefits: ["Quick turnaround bookings", "Group appointments", "Seasonal service promotion"],
    avgIncrease: "+31%"
  }
];

const features = [
  {
    icon: Phone,
    title: "24/7 Call Answering",
    description: "Never miss a call again. Our AI answers immediately, every time.",
    stat: "95% capture rate"
  },
  {
    icon: Clock,
    title: "Instant Booking",
    description: "Clients get booked immediately without waiting for callbacks.",
    stat: "3 second response"
  },
  {
    icon: TrendingUp,
    title: "Revenue Recovery",
    description: "Turn every missed call into revenue with intelligent conversation.",
    stat: "$19K avg monthly gain"
  },
  {
    icon: Users,
    title: "Client Experience",
    description: "Professional, friendly service that matches your brand voice.",
    stat: "98% satisfaction"
  }
];

const testimonials = [
  {
    business: "Luxe Beauty Studio",
    type: "Hair Salon",
    owner: "Sarah Chen",
    quote: "BookMySalon increased our bookings by 40% in the first month. The AI handles our busiest times perfectly.",
    revenue: "+$23K/month",
    location: "San Francisco, CA"
  },
  {
    business: "The Gentleman's Cut",
    type: "Barbershop", 
    owner: "Marcus Rodriguez",
    quote: "Our clients love the instant booking. No more phone tag or missed opportunities.",
    revenue: "+$18K/month",
    location: "Austin, TX"
  },
  {
    business: "Serenity Day Spa",
    type: "Day Spa",
    owner: "Amanda Foster",
    quote: "The AI understands our complex packages and upsells better than we expected.",
    revenue: "+$31K/month",
    location: "Los Angeles, CA"
  }
];

export default function ForBusinesses() {
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

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
              <Users className="w-4 h-4 text-foreground mr-2" />
              <span className="text-sm text-foreground font-medium">For Beauty Businesses</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-static">
              Transform Your Salon with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Join thousands of salons and barbershops using BookMySalon to capture every missed call and boost revenue.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold glow-primary-strong" data-testid="button-start-trial">
                <Link href="/#pricing">
                  Start 14-Day Free Trial
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold" data-testid="button-book-demo">
                <Link href="/contact">
                  Book a Demo
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2,500+</div>
                <div className="text-muted-foreground text-sm">Active Salons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-muted-foreground text-sm">Call Capture Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$19K</div>
                <div className="text-muted-foreground text-sm">Avg Monthly Revenue Gain</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-muted-foreground text-sm">AI Availability</div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Types */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Perfect for Every Beauty Business
              </h2>
              <p className="text-xl text-muted-foreground">
                Tailored solutions for different types of beauty and wellness businesses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {businessTypes.map((business, index) => (
                <Card 
                  key={business.name}
                  className={`card-glow border-border/50 hover:border-primary/30 transition-all duration-300 text-center fade-in-delay-${index % 2 === 0 ? '1' : '2'}`}
                  data-testid={`card-business-${business.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-primary">
                      <business.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{business.name}</CardTitle>
                    <CardDescription>{business.description}</CardDescription>
                    <Badge className="bg-primary/20 text-primary border-primary/30 glow-primary">
                      {business.avgIncrease} revenue increase
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {business.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose BookMySalon?
              </h2>
              <p className="text-xl text-muted-foreground">
                Built specifically for beauty businesses with features that drive results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={feature.title}
                  className={`card-glow border-border/50 hover:border-primary/30 transition-all duration-300 text-center fade-in-delay-${index % 2 === 0 ? '1' : '2'}`}
                  data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <CardHeader>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-primary">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                    <Badge className="bg-primary text-primary-foreground glow-primary">
                      {feature.stat}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Success Stories from Real Businesses
              </h2>
              <p className="text-xl text-muted-foreground">
                See how salons and barbershops are transforming their revenue
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial.business}
                  className={`card-glow border-border/50 hover:border-primary/30 transition-all duration-300 fade-in-delay-${index === 0 ? '1' : index === 1 ? '2' : '1'}`}
                  data-testid={`card-testimonial-${testimonial.business.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="secondary">{testimonial.type}</Badge>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-primary fill-current" />
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-foreground">{testimonial.business}</CardTitle>
                    <CardDescription>{testimonial.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <blockquote className="text-muted-foreground italic mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.owner}</div>
                        <div className="text-sm text-muted-foreground">Owner</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{testimonial.revenue}</div>
                        <div className="text-xs text-muted-foreground">Revenue Gain</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="py-16 px-8">
                <Zap className="w-20 h-20 text-primary mx-auto mb-8 glow-primary-strong" />
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Ready to Stop Losing Money?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join the thousands of beauty businesses already using BookMySalon to capture every opportunity.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2 glow-primary" />
                    <div className="text-sm text-muted-foreground">14-day free trial</div>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2 glow-primary" />
                    <div className="text-sm text-muted-foreground">No setup fees</div>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2 glow-primary" />
                    <div className="text-sm text-muted-foreground">Cancel anytime</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold glow-primary-strong" data-testid="button-cta-start-trial">
                    <Link href="/register">
                      Start Free Trial
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg font-semibold" data-testid="button-cta-calculate-roi">
                    <Link href="/#roi-calculator">
                      Calculate Your ROI
                    </Link>
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  Average setup time: 5 minutes • Average ROI: 973% in first month
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xl font-bold text-foreground font-mono">BookMySalon</span>
                <img src="/logo.svg" alt="BookMySalon Logo" className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Transform your salon or barbershop with AI-powered call handling that never misses an opportunity.
              </p>
              <div className="text-sm text-muted-foreground">
                © 2025 BookMySalon. All rights reserved. <br />
                Contact us: <a href="mailto:hello@bookmysalon.tech" className="text-primary hover:text-primary/80">hello@bookmysalon.tech</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="/#roi-calculator" className="hover:text-primary transition-colors">ROI Calculator</a></li>
                <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="/#demo" className="hover:text-primary transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
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