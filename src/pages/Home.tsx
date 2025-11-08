import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import Features from "@/components/Features";
import Solution from "@/components/Solution";
import ROICalculatorSection from "@/components/ROICalculatorSection";
import Benefits from "@/components/Benefits";
import HowItWorks from "@/components/HowItWorks";
import AudioPlayer from "@/components/AudioPlayer";
import Pricing from "@/components/Pricing";
import IntegrationsSection from "@/components/IntegrationsSection";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    console.log('User logged in');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log('User logged out');
  };

  const handleCalculateROI = () => {
    // Scroll to calculator section
    document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
    console.log('Navigate to ROI Calculator');
  };

  const handleHearCall = () => {
    // Scroll to demo section
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
    console.log('Navigate to Audio Demo');
  };

  const handleSelectPlan = (planName: string) => {
    console.log(`Selected plan: ${planName}`);
    // TODO: Add plan selection logic
  };

  const handleDownloadDemo = (demoId: string) => {
    console.log(`Download demo: ${demoId}`);
    // TODO: Add demo download logic
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation 
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main>
        {/* 1. Hero Section - Highlight desired outcome and address objections */}
        <Hero 
          onCalculateROI={handleCalculateROI}
          onHearCall={handleHearCall}
        />
        
        {/* 2. Social Proof - Build trust with real results */}
        <SocialProof />
        
        {/* 3. Features - Concise subheadings for readability */}
        <Features />
        
        {/* 4. Solution - Show product in action with dashboard mockup */}
        <Solution />
        
        {/* 5. Stats - Numbers reinforce credibility (ROI Calculator) */}
        <ROICalculatorSection />
        
        {/* 6. Benefits - Value propositions (features tell, benefits sell) */}
        <Benefits />
        
        {/* 7. How It Works - Simplify process into 3-5 easy steps */}
        <HowItWorks />
        
        {/* 8. Demo - Hear AI in action */}
        <AudioPlayer 
          onDownloadDemo={handleDownloadDemo}
        />
        
        {/* 9. Pricing - Clear plans and value */}
        <Pricing 
          onSelectPlan={handleSelectPlan}
        />
        
        {/* 10. Integrations - Seamless tools users love */}
        <IntegrationsSection />
        
        {/* 11. Testimonials - Authentic stories with measurable results */}
        <Testimonials />
        
        {/* 12. FAQ - Address concerns with clear answers */}
        <FAQ />
        
        {/* 13. CTA - Combine actionable steps with compelling reasons */}
        <CTASection />
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
                <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#roi-calculator" className="hover:text-primary transition-colors">ROI Calculator</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#demo" className="hover:text-primary transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div className="order-2 md:order-3">
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}