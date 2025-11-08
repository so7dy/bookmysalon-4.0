import { useState, useEffect } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, DollarSign, Phone, Calendar } from "lucide-react";

export default function ROICalculator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    averageRevenue: 85,
    missedCalls: 5,
    conversionRate: 60,
    businessDays: 22
  });

  const [results, setResults] = useState({
    monthlyLostRevenue: 0,
    potentialImpact: 0,
    yearlyLostRevenue: 0,
    roiPercentage: 0
  });

  useEffect(() => {
    calculateResults();
  }, [formData]);

  const calculateResults = () => {
    const { averageRevenue, missedCalls, conversionRate, businessDays } = formData;
    
    // Calculate monthly lost revenue
    const monthlyLostRevenue = (averageRevenue * missedCalls * (conversionRate / 100) * businessDays);
    
    // Assume BookMySalon captures 95% of missed calls
    const potentialImpact = monthlyLostRevenue * 0.95;
    
    // Yearly calculations
    const yearlyLostRevenue = monthlyLostRevenue * 12;
    
    // ROI calculation (assuming $399/month plan)
    const monthlyCost = 399;
    const roiPercentage = ((potentialImpact - monthlyCost) / monthlyCost) * 100;

    setResults({
      monthlyLostRevenue: Math.round(monthlyLostRevenue),
      potentialImpact: Math.round(potentialImpact),
      yearlyLostRevenue: Math.round(yearlyLostRevenue),
      roiPercentage: Math.round(roiPercentage)
    });
  };

  const handleInputChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
              <Calculator className="w-4 h-4 text-foreground mr-2" />
              <span className="text-sm text-foreground font-medium">ROI Calculator</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-static">
              Calculate Your Lost Revenue
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Discover exactly how much revenue you're losing from missed calls and see your potential ROI with BookMySalon.
            </p>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <Card className="card-glow border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Your Business Details</CardTitle>
                  <CardDescription>
                    Adjust the sliders below to match your salon or barbershop
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <Label className="text-base font-medium">Average Revenue per Client</Label>
                    <div className="mt-4">
                      <Slider
                        value={[formData.averageRevenue]}
                        onValueChange={(value) => handleInputChange('averageRevenue', value[0])}
                        max={500}
                        min={20}
                        step={5}
                        className="w-full"
                        data-testid="slider-average-revenue"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>$20</span>
                        <span className="text-primary font-bold text-lg">{formatCurrency(formData.averageRevenue)}</span>
                        <span>$500</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Missed Calls per Day</Label>
                    <div className="mt-4">
                      <Slider
                        value={[formData.missedCalls]}
                        onValueChange={(value) => handleInputChange('missedCalls', value[0])}
                        max={50}
                        min={1}
                        step={1}
                        className="w-full"
                        data-testid="slider-missed-calls"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>1</span>
                        <span className="text-primary font-bold text-lg">{formData.missedCalls} calls</span>
                        <span>50</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Call-to-Booking Conversion Rate</Label>
                    <div className="mt-4">
                      <Slider
                        value={[formData.conversionRate]}
                        onValueChange={(value) => handleInputChange('conversionRate', value[0])}
                        max={100}
                        min={10}
                        step={5}
                        className="w-full"
                        data-testid="slider-conversion-rate"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>10%</span>
                        <span className="text-primary font-bold text-lg">{formData.conversionRate}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Business Days per Month</Label>
                    <div className="mt-4">
                      <Slider
                        value={[formData.businessDays]}
                        onValueChange={(value) => handleInputChange('businessDays', value[0])}
                        max={31}
                        min={15}
                        step={1}
                        className="w-full"
                        data-testid="slider-business-days"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>15 days</span>
                        <span className="text-primary font-bold text-lg">{formData.businessDays} days</span>
                        <span>31 days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                <Card className="card-glow border-destructive/30 bg-gradient-to-r from-destructive/5 to-destructive/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-destructive" />
                      Monthly Lost Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-destructive mb-2" data-testid="text-monthly-lost">
                      {formatCurrency(results.monthlyLostRevenue)}
                    </div>
                    <p className="text-muted-foreground">
                      Revenue lost each month from missed calls
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-glow border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-primary" />
                      Potential Monthly Recovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary mb-2" data-testid="text-potential-impact">
                      {formatCurrency(results.potentialImpact)}
                    </div>
                    <p className="text-muted-foreground">
                      Revenue you could recover with BookMySalon (95% capture rate)
                    </p>
                  </CardContent>
                </Card>

                <Card className="card-glow border-border/50">
                  <CardHeader>
                    <CardTitle className="text-xl text-foreground">Annual Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground">Yearly Lost Revenue</div>
                        <div className="text-2xl font-bold text-destructive" data-testid="text-yearly-lost">
                          {formatCurrency(results.yearlyLostRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">ROI Percentage</div>
                        <div className="text-2xl font-bold text-primary" data-testid="text-roi-percentage">
                          {results.roiPercentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-4">
                        Based on our Professional plan ($399/month)
                      </p>
                      <Button asChild
                        className="w-full glow-primary-strong" 
                        size="lg"
                        data-testid="button-start-trial"
                      >
                        <Link href="/register">
                          Start 14-Day Free Trial
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <section className="py-16 bg-card/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Why These Numbers Matter
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Every Call Counts</h3>
                <p className="text-muted-foreground text-sm">
                  Studies show salons lose 20-40% of potential bookings from missed calls
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Compound Effect</h3>
                <p className="text-muted-foreground text-sm">
                  Lost revenue compounds monthly, affecting your annual growth potential
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Quick Recovery</h3>
                <p className="text-muted-foreground text-sm">
                  Most clients see ROI within the first week of implementation
                </p>
              </div>
            </div>

            <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 max-w-2xl mx-auto">
              <CardContent className="py-8">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Ready to Stop Losing Revenue?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start capturing every missed call today with our 14-day free trial
                </p>
                <Button asChild className="glow-primary" size="lg" data-testid="button-get-started">
                  <Link href="/register">
                    Get Started Now
                  </Link>
                </Button>
              </CardContent>
            </Card>
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