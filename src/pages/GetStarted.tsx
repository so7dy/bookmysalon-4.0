import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Users, 
  Calendar,
  Phone,
  Sparkles,
  CheckCircle2,
  TrendingUp
} from "lucide-react";
import { leadFormSchema, type LeadForm } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";

export default function GetStarted() {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useLocation();
  const totalSteps = 5; // Including ROI calculator

  const form = useForm<LeadForm>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      email: "",
      phone: "",
      businessType: "salon",
      website: "",
      staffCount: 1,
      weeklyBookings: "<50",
      currentBookingMethods: [],
      biggestChallenges: [],
      servicesOffered: "",
      operatingHours: "",
      hasCalendarSystem: false,
      currentCalendar: "",
      preferredLanguages: [],
      voiceStyle: "professional-female",
      specialRequirements: "",
      timeline: "asap",
      budgetRange: "99-199",
      agreedToContact: false,
    },
  });

  // ROI Calculator state
  const [avgBookingValue, setAvgBookingValue] = useState(80);
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(15);
  const calculatedROI = avgBookingValue * missedCallsPerWeek * 4 * 0.4; // 40% conversion

  const submitMutation = useMutation({
    mutationFn: async (data: LeadForm) => {
      const response = await fetch("/api/lead-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      
      return response.json();
    },
    onSuccess: () => {
      setLocation("/lead-thank-you");
    },
  });

  const onSubmit = (data: LeadForm) => {
    submitMutation.mutate(data);
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(step);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFieldsForStep = (currentStep: number): (keyof LeadForm)[] => {
    switch (currentStep) {
      case 1:
        return ["businessName", "contactName", "email", "phone", "businessType"];
      case 2:
        return ["staffCount", "weeklyBookings", "currentBookingMethods", "biggestChallenges"];
      case 3:
        return []; // ROI Calculator - no validation
      case 4:
        return ["servicesOffered", "operatingHours", "preferredLanguages", "voiceStyle"];
      case 5:
        return ["timeline", "agreedToContact"];
      default:
        return [];
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Get Your Custom AI Receptionist
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Let's Build Your Perfect AI Agent
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer a few quick questions so we can create an AI receptionist tailored specifically to your business
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {step} of {totalSteps}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-form" />
          </div>

          {/* Form Card */}
          <Card className="border-primary/20">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* Step 1: Business Information */}
                {step === 1 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Business Information</h2>
                        <p className="text-sm text-muted-foreground">Tell us about your business</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          {...form.register("businessName")}
                          placeholder="e.g., Elite Hair Salon"
                          data-testid="input-business-name"
                        />
                        {form.formState.errors.businessName && (
                          <p className="text-sm text-destructive">{form.formState.errors.businessName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactName">Your Name *</Label>
                        <Input
                          id="contactName"
                          {...form.register("contactName")}
                          placeholder="e.g., Sarah Johnson"
                          data-testid="input-contact-name"
                        />
                        {form.formState.errors.contactName && (
                          <p className="text-sm text-destructive">{form.formState.errors.contactName.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...form.register("email")}
                          placeholder="sarah@elitesalon.com"
                          data-testid="input-email"
                        />
                        {form.formState.errors.email && (
                          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...form.register("phone")}
                          placeholder="+1 (555) 123-4567"
                          data-testid="input-phone"
                        />
                        {form.formState.errors.phone && (
                          <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select
                          value={form.watch("businessType")}
                          onValueChange={(value) => form.setValue("businessType", value as any)}
                        >
                          <SelectTrigger data-testid="select-business-type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="salon">Salon</SelectItem>
                            <SelectItem value="barbershop">Barbershop</SelectItem>
                            <SelectItem value="spa">Spa</SelectItem>
                            <SelectItem value="beauty-studio">Beauty Studio</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website (Optional)</Label>
                        <Input
                          id="website"
                          {...form.register("website")}
                          placeholder="www.elitesalon.com"
                          data-testid="input-website"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Current Setup */}
                {step === 2 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Current Setup</h2>
                        <p className="text-sm text-muted-foreground">Help us understand your current operations</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffCount">Number of Staff Members *</Label>
                        <Input
                          id="staffCount"
                          type="number"
                          min="1"
                          {...form.register("staffCount", { valueAsNumber: true })}
                          placeholder="e.g., 5"
                          data-testid="input-staff-count"
                        />
                        {form.formState.errors.staffCount && (
                          <p className="text-sm text-destructive">{form.formState.errors.staffCount.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weeklyBookings">Current Weekly Bookings *</Label>
                        <Select
                          value={form.watch("weeklyBookings")}
                          onValueChange={(value) => form.setValue("weeklyBookings", value as any)}
                        >
                          <SelectTrigger data-testid="select-weekly-bookings">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<50">Less than 50/week</SelectItem>
                            <SelectItem value="50-100">50-100/week</SelectItem>
                            <SelectItem value="100-200">100-200/week</SelectItem>
                            <SelectItem value="200+">200+ /week</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>How do customers currently book? * (Select all that apply)</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {["Phone calls", "Online booking", "Walk-ins", "Social media"].map((method) => (
                          <div key={method} className="flex items-center space-x-2">
                            <Checkbox
                              id={`method-${method}`}
                              checked={form.watch("currentBookingMethods")?.includes(method)}
                              onCheckedChange={(checked) => {
                                const current = form.watch("currentBookingMethods") || [];
                                if (checked) {
                                  form.setValue("currentBookingMethods", [...current, method]);
                                } else {
                                  form.setValue("currentBookingMethods", current.filter(m => m !== method));
                                }
                              }}
                              data-testid={`checkbox-booking-method-${method.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <label htmlFor={`method-${method}`} className="text-sm text-foreground cursor-pointer">
                              {method}
                            </label>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.currentBookingMethods && (
                        <p className="text-sm text-destructive">{form.formState.errors.currentBookingMethods.message}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label>What are your biggest challenges? * (Select all that apply)</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          "Missed calls after hours",
                          "No-shows and cancellations",
                          "Manual booking takes too much time",
                          "Need better calendar management"
                        ].map((challenge) => (
                          <div key={challenge} className="flex items-center space-x-2">
                            <Checkbox
                              id={`challenge-${challenge}`}
                              checked={form.watch("biggestChallenges")?.includes(challenge)}
                              onCheckedChange={(checked) => {
                                const current = form.watch("biggestChallenges") || [];
                                if (checked) {
                                  form.setValue("biggestChallenges", [...current, challenge]);
                                } else {
                                  form.setValue("biggestChallenges", current.filter(c => c !== challenge));
                                }
                              }}
                              data-testid={`checkbox-challenge-${challenge.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                            <label htmlFor={`challenge-${challenge}`} className="text-sm text-foreground cursor-pointer">
                              {challenge}
                            </label>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.biggestChallenges && (
                        <p className="text-sm text-destructive">{form.formState.errors.biggestChallenges.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: ROI Calculator */}
                {step === 3 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">See Your Potential ROI</h2>
                        <p className="text-sm text-muted-foreground">Calculate how much revenue you could recover</p>
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6 space-y-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label>Average Booking Value</Label>
                            <span className="text-lg font-semibold text-foreground">${avgBookingValue}</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="300"
                            step="5"
                            value={avgBookingValue}
                            onChange={(e) => setAvgBookingValue(Number(e.target.value))}
                            className="w-full"
                            data-testid="slider-booking-value"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label>Missed Calls Per Week</Label>
                            <span className="text-lg font-semibold text-foreground">{missedCallsPerWeek}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={missedCallsPerWeek}
                            onChange={(e) => setMissedCallsPerWeek(Number(e.target.value))}
                            className="w-full"
                            data-testid="slider-missed-calls"
                          />
                        </div>
                      </div>

                      <div className="border-t border-border pt-6">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Estimated Monthly Revenue Recovery</p>
                          <p className="text-4xl font-bold text-primary mb-2" data-testid="text-roi-value">
                            ${calculatedROI.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Based on 40% conversion rate of recovered calls
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">24/7 Coverage</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Never miss a call again</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Instant Booking</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Real-time calendar sync</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-semibold text-foreground">Cost Effective</span>
                          </div>
                          <p className="text-xs text-muted-foreground">From $99/month</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm text-foreground text-center">
                        <span className="font-semibold">Great news!</span> Your business could recover <span className="font-bold text-primary">${calculatedROI.toLocaleString()}/month</span> in lost revenue with our AI receptionist.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 4: Services & AI Preferences */}
                {step === 4 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Services & AI Preferences</h2>
                        <p className="text-sm text-muted-foreground">Customize your AI receptionist</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="servicesOffered">Services You Offer * (one per line)</Label>
                      <Textarea
                        id="servicesOffered"
                        {...form.register("servicesOffered")}
                        placeholder="e.g.,&#10;Haircut - $45 - 30min&#10;Coloring - $120 - 90min&#10;Highlights - $150 - 120min"
                        rows={4}
                        data-testid="input-services-offered"
                      />
                      {form.formState.errors.servicesOffered && (
                        <p className="text-sm text-destructive">{form.formState.errors.servicesOffered.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="operatingHours">Operating Hours *</Label>
                      <Input
                        id="operatingHours"
                        {...form.register("operatingHours")}
                        placeholder="e.g., Mon-Fri 9am-7pm, Sat 10am-6pm"
                        data-testid="input-operating-hours"
                      />
                      {form.formState.errors.operatingHours && (
                        <p className="text-sm text-destructive">{form.formState.errors.operatingHours.message}</p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label>Preferred Language(s) * (Select all that apply)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {["English", "Spanish", "French", "Mandarin", "Arabic", "Portuguese"].map((lang) => (
                          <div key={lang} className="flex items-center space-x-2">
                            <Checkbox
                              id={`lang-${lang}`}
                              checked={form.watch("preferredLanguages")?.includes(lang)}
                              onCheckedChange={(checked) => {
                                const current = form.watch("preferredLanguages") || [];
                                if (checked) {
                                  form.setValue("preferredLanguages", [...current, lang]);
                                } else {
                                  form.setValue("preferredLanguages", current.filter(l => l !== lang));
                                }
                              }}
                              data-testid={`checkbox-language-${lang.toLowerCase()}`}
                            />
                            <label htmlFor={`lang-${lang}`} className="text-sm text-foreground cursor-pointer">
                              {lang}
                            </label>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.preferredLanguages && (
                        <p className="text-sm text-destructive">{form.formState.errors.preferredLanguages.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="voiceStyle">AI Voice Style *</Label>
                      <Select
                        value={form.watch("voiceStyle")}
                        onValueChange={(value) => form.setValue("voiceStyle", value as any)}
                      >
                        <SelectTrigger data-testid="select-voice-style">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional-female">Professional Female</SelectItem>
                          <SelectItem value="professional-male">Professional Male</SelectItem>
                          <SelectItem value="friendly-casual">Friendly & Casual</SelectItem>
                          <SelectItem value="warm-welcoming">Warm & Welcoming</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                      <Textarea
                        id="specialRequirements"
                        {...form.register("specialRequirements")}
                        placeholder="Any specific phrases, policies, or booking rules?"
                        rows={3}
                        data-testid="input-special-requirements"
                      />
                    </div>
                  </div>
                )}

                {/* Step 5: Timeline & Consent */}
                {step === 5 && (
                  <div className="space-y-6 fade-in">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Almost Done!</h2>
                        <p className="text-sm text-muted-foreground">Just a couple more details</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="timeline">When would you like to start? *</Label>
                        <Select
                          value={form.watch("timeline")}
                          onValueChange={(value) => form.setValue("timeline", value as any)}
                        >
                          <SelectTrigger data-testid="select-timeline">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">As soon as possible</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                            <SelectItem value="3-months">Within 3 months</SelectItem>
                            <SelectItem value="exploring">Just exploring options</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="budgetRange">Budget Range (Optional)</Label>
                        <Select
                          value={form.watch("budgetRange")}
                          onValueChange={(value) => form.setValue("budgetRange", value as any)}
                        >
                          <SelectTrigger data-testid="select-budget">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="99-199">$99-199/month</SelectItem>
                            <SelectItem value="199-399">$199-399/month</SelectItem>
                            <SelectItem value="399+">$399+/month</SelectItem>
                            <SelectItem value="custom">Need custom pricing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold text-foreground">What happens next?</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Personalized Setup Plan</p>
                            <p className="text-xs text-muted-foreground">We'll create a custom AI agent configuration based on your responses</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Quick Setup Call</p>
                            <p className="text-xs text-muted-foreground">Our team will contact you within 24 hours to schedule your onboarding</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Go Live in Days</p>
                            <p className="text-xs text-muted-foreground">Your AI receptionist will be answering calls within 48-72 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreedToContact"
                        checked={form.watch("agreedToContact")}
                        onCheckedChange={(checked) => form.setValue("agreedToContact", checked as boolean)}
                        data-testid="checkbox-agree-contact"
                      />
                      <label htmlFor="agreedToContact" className="text-sm text-foreground cursor-pointer">
                        I agree to be contacted by BookMySalon about setting up my AI receptionist. We respect your privacy and will never spam you. *
                      </label>
                    </div>
                    {form.formState.errors.agreedToContact && (
                      <p className="text-sm text-destructive">{form.formState.errors.agreedToContact.message}</p>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      data-testid="button-prev-step"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                  )}
                  
                  {step < totalSteps ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="ml-auto glow-primary"
                      data-testid="button-next-step"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitMutation.isPending}
                      className="ml-auto glow-primary"
                      data-testid="button-submit-form"
                    >
                      {submitMutation.isPending ? "Submitting..." : "Get My Custom AI Receptionist"}
                      <Sparkles className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Trust Signals */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 flex-wrap text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Free setup assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
