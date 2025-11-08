import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Calculator, Sparkles } from "lucide-react";
import AnimatedHeroBackground from "./AnimatedHeroBackground";
import { Link } from "wouter";

interface HeroProps {
  onCalculateROI?: () => void;
  onHearCall?: () => void;
}

export default function Hero({ onCalculateROI, onHearCall }: HeroProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const fullText = "Never Miss a Client Call Again";

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const handleCalculateROI = () => {
    console.log('Calculate ROI triggered');
    onCalculateROI?.();
  };

  const handleHearCall = () => {
    console.log('Hear Call triggered');
    onHearCall?.();
  };

  return (
    <section id="home" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden py-20 sm:py-0">
      <AnimatedHeroBackground />
      
      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 sm:pt-0">
        <div className="fade-in">
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary">
              <Sparkles className="w-4 h-4 text-foreground mr-2" />
              <span className="text-sm text-foreground font-medium">AI-Powered Technology</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className={`gradient-text-static ${!isTypingComplete ? 'typing-cursor' : ''}`}>
              {displayText}
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto fade-in-delay-1 px-4">
            AI-powered appointment setter that captures every missed call and books new clients for your salon or barbershop.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center fade-in-delay-2 px-4">
            <a href="#roi-calculator" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold glow-primary-strong hover:scale-105 transition-transform duration-200"
                data-testid="button-calculate-roi"
              >
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Calculate Your ROI
              </Button>
            </a>
            
            <a href="#demo" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold border-primary/50 hover:border-primary hover:bg-primary/10 hover:scale-105 transition-all duration-200"
                data-testid="button-hear-call"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Hear a Call
              </Button>
            </a>
          </div>
          
          {/* Stats */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-center fade-in-delay-1">
              <div className="text-3xl sm:text-4xl font-bold text-primary">95%</div>
              <div className="text-sm sm:text-base text-muted-foreground mt-2">Call Capture Rate</div>
            </div>
            <div className="text-center fade-in-delay-2">
              <div className="text-3xl sm:text-4xl font-bold text-primary">$2.5K</div>
              <div className="text-sm sm:text-base text-muted-foreground mt-2">Average Monthly ROI</div>
            </div>
            <div className="text-center fade-in-delay-1">
              <div className="text-3xl sm:text-4xl font-bold text-primary">24/7</div>
              <div className="text-sm sm:text-base text-muted-foreground mt-2">AI Availability</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/80 pointer-events-none"></div>
    </section>
  );
}