import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight, Check, Calculator } from "lucide-react";
import { customPlanSchema, type CustomPlanFormData } from "@shared/schema";
import { calculatePricing, formatPrice, type PricingConfig } from "@/lib/pricingCalculator";
import { calculateROI, formatCurrency, formatPercentage, type ROIConfig } from "@/lib/roiCalculator";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Business Info", "AI Configuration", "Pricing & ROI", "Confirmation"];

export default function CustomPlanConfigure() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  const form = useForm<CustomPlanFormData>({
    resolver: zodResolver(customPlanSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      businessType: "salon",
      website: "",
      callsPerMonth: 200,
      avgCallDuration: 7,
      locations: 1,
      smsConfirmations: true,
      smsReminders: true,
      avgRevenuePerClient: 85,
      missedCallsPerDay: 15,
      conversionRate: 0.6,
      businessDaysPerMonth: 30,
      agreeToTerms: false,
      agreeToPrivacy: false,
      receiveUpdates: false,
    },
  });

  const watchedValues = form.watch();
  
  // Calculate pricing in real-time
  const pricingConfig: PricingConfig = {
    callsPerMonth: watchedValues.callsPerMonth,
    avgCallDurationMinutes: watchedValues.avgCallDuration,
    locations: watchedValues.locations,
    smsConfirmations: watchedValues.smsConfirmations,
    smsReminders: watchedValues.smsReminders,
  };
  
  const pricing = calculatePricing(pricingConfig);
  
  // Calculate ROI in real-time
  const roiConfig: ROIConfig = {
    avgRevenuePerClient: watchedValues.avgRevenuePerClient,
    missedCallsPerDay: watchedValues.missedCallsPerDay,
    conversionRate: watchedValues.conversionRate,
    businessDaysPerMonth: watchedValues.businessDaysPerMonth,
    monthlySubscriptionPrice: pricing.clientPrice,
  };
  
  const roi = calculateROI(roiConfig);

  const progress = ((currentStep + 1) / (STEPS.length + 1)) * 100;

  const onSubmit = async (data: CustomPlanFormData) => {
    try {
      // Send form data (server will calculate pricing and ROI)
      const response = await fetch("/api/custom-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      // Get server-calculated pricing and ROI
      const responseData = await response.json();
      
      // Store in localStorage for thank you page (with server-calculated values)
      const submissionData = {
        ...data,
        pricing: responseData.pricing,
        roi: responseData.roi,
      };
      localStorage.setItem("customPlanSubmission", JSON.stringify(submissionData));

      toast({
        title: "Success!",
        description: "Your custom plan has been submitted.",
      });

      setLocation("/thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate as any);
    
    if (isValid) {
      if (currentStep === STEPS.length - 1) {
        form.handleSubmit(onSubmit)();
      } else {
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 0) {
      // On first step, go back to homepage
      setLocation('/');
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  };

  function getFieldsForStep(step: number): (keyof CustomPlanFormData)[] {
    switch (step) {
      case 0:
        return ["businessName", "contactName", "email", "phone", "businessType"];
      case 1:
        return ["callsPerMonth", "avgCallDuration", "locations"];
      case 2:
        return ["avgRevenuePerClient", "missedCallsPerDay", "conversionRate", "businessDaysPerMonth"];
      case 3:
        return ["agreeToTerms", "agreeToPrivacy"];
      default:
        return [];
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button - Top of Page */}
        <div className="mb-6">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            data-testid="button-back-top"
            className="hover-elevate"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step}
                className={`flex-1 text-center ${
                  index <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className="text-sm font-medium">{step}</div>
              </div>
            ))}
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center mt-2 text-sm text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length} ({Math.round(progress)}% Complete)
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1: Business Information */}
            {currentStep === 0 && (
              <Card data-testid="card-step-1">
                <CardHeader>
                  <CardTitle>Tell us about your business</CardTitle>
                  <CardDescription>
                    We'll use this information to customize your AI agent and contact you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Luxe Salon & Spa" {...field} data-testid="input-business-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Smith" {...field} data-testid="input-contact-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@luxesalon.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-business-type">
                              <SelectValue placeholder="Select your business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="salon">Salon</SelectItem>
                            <SelectItem value="barbershop">Barbershop</SelectItem>
                            <SelectItem value="spa">Spa</SelectItem>
                            <SelectItem value="med-spa">Med Spa</SelectItem>
                            <SelectItem value="beauty-clinic">Beauty Clinic</SelectItem>
                            <SelectItem value="hair-studio">Hair Studio</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://luxesalon.com" {...field} data-testid="input-website" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Step 2: AI Agent Configuration */}
            {currentStep === 1 && (
              <Card data-testid="card-step-2">
                <CardHeader>
                  <CardTitle>Configure Your AI Voice Agent</CardTitle>
                  <CardDescription>
                    We believe you shouldn't pay for features you don't use. Configure your AI assistant based on your actual call volume and needs.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="callsPerMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many calls do you expect per month?</FormLabel>
                        <div className="text-2xl font-bold text-primary mb-2">
                          {field.value} calls
                        </div>
                        <FormControl>
                          <Slider
                            min={50}
                            max={2000}
                            step={50}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            data-testid="slider-calls"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="avgCallDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average call duration (minutes)</FormLabel>
                        <div className="text-2xl font-bold text-primary mb-2">
                          {field.value} minutes
                        </div>
                        <FormControl>
                          <Slider
                            min={3}
                            max={15}
                            step={1}
                            value={[field.value]}
                            onValueChange={(value) => field.onChange(value[0])}
                            data-testid="slider-duration"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many locations do you have?</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={50}
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            data-testid="input-locations"
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">
                          Each location gets a dedicated AI agent + phone number
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <FormLabel>Select features you need:</FormLabel>
                    
                    <FormField
                      control={form.control}
                      name="smsConfirmations"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-sms-confirmations"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">SMS Booking Confirmations</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="smsReminders"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-sms-reminders"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">SMS Appointment Reminders</FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center space-x-2 opacity-60">
                      <Checkbox checked={true} disabled />
                      <FormLabel className="!mt-0">Calendar Integration (Always included)</FormLabel>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Pricing & ROI */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT: Pricing Summary */}
                <Card data-testid="card-pricing-summary">
                  <CardHeader>
                    <CardTitle>Your Custom Plan</CardTitle>
                    <CardDescription>Based on your configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">Your Plan Includes:</h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            AI Voice Agent: {watchedValues.callsPerMonth} calls/month × {watchedValues.avgCallDuration} minutes, 24/7 automated booking
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Phone Service: {watchedValues.locations} dedicated phone number{watchedValues.locations > 1 ? 's' : ''}</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>
                            SMS Services: {watchedValues.smsConfirmations ? 'Confirmations ✓' : ''} {watchedValues.smsReminders ? 'Reminders ✓' : ''}
                          </span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Email & Calendar: Notifications & sync (included)</span>
                        </li>
                        {watchedValues.locations > 1 && (
                          <li className="flex items-start space-x-2">
                            <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>Multi-Location Setup: {watchedValues.locations} AI agents</span>
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">YOUR MONTHLY INVESTMENT</div>
                        <div className="text-4xl font-bold text-primary" data-testid="text-monthly-price">
                          {formatPrice(pricing.clientPrice)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2 space-y-1">
                          <div>Save 15% with annual billing</div>
                          <div className="text-primary font-medium">
                            {formatPrice(pricing.annualPrice)}/year (Save {formatPrice(pricing.annualSavings)})
                          </div>
                          <div>Setup & training included</div>
                          <div>Cancel anytime</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* RIGHT: ROI Calculator */}
                <Card data-testid="card-roi-calculator">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5" />
                      <CardTitle>Calculate Your Return</CardTitle>
                    </div>
                    <CardDescription>See how much you'll save with AI receptionist</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                      {/* Simplified Input Fields */}
                      <FormField
                        control={form.control}
                        name="avgRevenuePerClient"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Average Revenue per Client</FormLabel>
                            <div className="text-2xl font-bold text-primary mb-2">
                              ${field.value}
                            </div>
                            <FormControl>
                              <Slider
                                min={20}
                                max={500}
                                step={5}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                data-testid="slider-revenue"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">
                              Typical service value per client
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="missedCallsPerDay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Missed Calls per Day</FormLabel>
                            <div className="text-2xl font-bold text-primary mb-2">
                              {field.value} calls
                            </div>
                            <FormControl>
                              <Slider
                                min={1}
                                max={50}
                                step={1}
                                value={[field.value]}
                                onValueChange={(value) => field.onChange(value[0])}
                                data-testid="slider-missed-calls"
                              />
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">
                              Calls you currently miss when busy
                            </p>
                          </FormItem>
                        )}
                      />
                      
                      {/* ROI Results - Focused on Key Metrics */}
                      <div className="border-t pt-6 space-y-4">
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20">
                          <div className="text-center space-y-4">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">Monthly Net Profit</div>
                              <div className="text-4xl font-bold text-primary" data-testid="text-net-profit">
                                +{formatCurrency(roi.netProfit)}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">ROI</div>
                                <div className="text-2xl font-bold text-primary" data-testid="text-roi">
                                  {formatPercentage(roi.roiPercentage)}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Payback</div>
                                <div className="text-2xl font-bold text-primary">
                                  {roi.paybackDays} days
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t border-primary/20">
                              <div className="text-xs text-muted-foreground mb-1">Annual Impact</div>
                              <div className="text-3xl font-bold text-primary">
                                +{formatCurrency(roi.annualImpact)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-center text-muted-foreground">
                          Based on 100% AI capture rate • 30 business days/month
                        </div>
                      </div>
                    </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Final Confirmation */}
            {currentStep === 3 && (
              <Card data-testid="card-step-4">
                <CardHeader>
                  <CardTitle>Confirm Your Details</CardTitle>
                  <CardDescription>Review your information before submitting</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium mb-2">Business Information:</div>
                      <ul className="space-y-1 text-muted-foreground">
                        <li><span className="font-medium text-foreground">Business:</span> {watchedValues.businessName}</li>
                        <li><span className="font-medium text-foreground">Contact:</span> {watchedValues.contactName}</li>
                        <li><span className="font-medium text-foreground">Email:</span> {watchedValues.email}</li>
                        <li><span className="font-medium text-foreground">Phone:</span> {watchedValues.phone}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-medium mb-2">Plan Configuration:</div>
                      <ul className="space-y-1 text-muted-foreground">
                        <li>{watchedValues.callsPerMonth} calls/month</li>
                        <li>{watchedValues.avgCallDuration} min avg duration</li>
                        <li>{watchedValues.locations} location{watchedValues.locations > 1 ? 's' : ''}</li>
                        <li>{watchedValues.smsConfirmations && 'SMS Confirmations'} {watchedValues.smsReminders && '+ Reminders'}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-lg">
                      <span>Monthly Subscription:</span>
                      <span className="font-bold text-primary">{formatPrice(pricing.clientPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Estimated Monthly Profit:</span>
                      <span className="font-medium text-primary">+{formatCurrency(roi.netProfit)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Return on Investment:</span>
                      <span className="font-medium">{formatPercentage(roi.roiPercentage)}</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4 space-y-4">
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-terms"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer">
                            I agree to the <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a> *
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="agreeToPrivacy"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-privacy"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 cursor-pointer">
                            I agree to the <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a> *
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="receiveUpdates"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-updates"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">
                            I'd like to receive product updates and tips (optional)
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                data-testid="button-back"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              <Button
                type="button"
                onClick={nextStep}
                className="glow-primary"
                data-testid="button-continue"
              >
                {currentStep === STEPS.length - 1 ? 'Submit Order' : 'Continue'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
