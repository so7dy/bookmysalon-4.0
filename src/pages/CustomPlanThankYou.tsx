import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Mail, Phone, Calendar, Rocket } from "lucide-react";
import { formatPrice } from "@/lib/pricingCalculator";
import { formatCurrency, formatPercentage } from "@/lib/roiCalculator";

export default function CustomPlanThankYou() {
  const [submissionData, setSubmissionData] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("customPlanSubmission");
    if (data) {
      setSubmissionData(JSON.parse(data));
    }
  }, []);

  if (!submissionData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No submission data found.</p>
            <Button asChild>
              <Link href="/pricing">Return to Pricing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextSteps = [
    {
      icon: Mail,
      title: `You'll receive confirmation email at ${submissionData.email}`,
      description: "Check your inbox (and spam folder) for our detailed confirmation"
    },
    {
      icon: Phone,
      title: "Our team will contact you within 24 hours",
      description: "We'll discuss your specific needs and answer any questions"
    },
    {
      icon: Calendar,
      title: "We'll schedule your onboarding session",
      description: "Dedicated training to get your AI agent configured perfectly"
    },
    {
      icon: Rocket,
      title: "Your AI agent will be live in 2-3 days",
      description: "Start capturing those missed calls and growing your revenue!"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 glow-primary">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="heading-thank-you">
            🎉 Thank You, {submissionData.contactName}!
          </h1>
          <p className="text-xl text-muted-foreground">
            Your Custom Plan is Being Prepared
          </p>
        </div>

        {/* What Happens Next */}
        <Card className="mb-8" data-testid="card-next-steps">
          <CardHeader>
            <CardTitle className="text-2xl">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">
                    {index + 1}. {step.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Plan Summary */}
        <Card className="mb-8" data-testid="card-plan-summary">
          <CardHeader>
            <CardTitle>Your Plan Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground mb-2">Business:</div>
                <div className="font-medium">{submissionData.businessName}</div>
              </div>
              <div>
                <div className="text-muted-foreground mb-2">Contact:</div>
                <div className="font-medium">{submissionData.email}</div>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Monthly Investment:</span>
                <span className="text-2xl font-bold text-primary" data-testid="text-monthly-investment">
                  {formatPrice(submissionData.pricing.clientPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Expected Monthly Profit:</span>
                <span className="font-medium text-primary" data-testid="text-expected-profit">
                  +{formatCurrency(submissionData.roi.netProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Return on Investment:</span>
                <span className="font-medium" data-testid="text-roi-percentage">
                  {formatPercentage(submissionData.roi.roiPercentage)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Locations:</span>
                <span className="font-medium">{submissionData.locations}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-foreground mb-2">Questions?</p>
            <a 
              href="mailto:hello@bookmysalon.tech" 
              className="text-primary hover:underline font-medium"
              data-testid="link-email-support"
            >
              Email us at hello@bookmysalon.tech
            </a>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline" size="lg" data-testid="button-return-home">
            <Link href="/">Return to Homepage</Link>
          </Button>
          <Button asChild size="lg" className="glow-primary" data-testid="button-book-call">
            <a href="mailto:hello@bookmysalon.tech?subject=Book Onboarding Call - ${submissionData.businessName}">
              Book Onboarding Call
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
