import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does BookMySalon's AI handle phone calls?",
    answer: "Our AI uses advanced natural language processing to understand caller intent, answer questions about your services, check availability, and book appointments in real-time. It sounds completely natural and can handle complex conversations including rescheduling, cancellations, and service inquiries."
  },
  {
    question: "What happens if the AI can't handle a specific request?",
    answer: "The AI is trained to recognize when a situation requires human intervention. It will politely inform the caller that a team member will call them back, capture their information, and immediately notify you via SMS and email. This ensures no opportunity is lost."
  },
  {
    question: "How quickly can I set up BookMySalon?",
    answer: "Setup takes just 5-10 minutes. We'll connect to your existing booking system, train the AI on your services and availability, and have you taking AI-powered calls the same day. Our team handles all the technical setup for you."
  },
  {
    question: "Will clients know they're talking to an AI?",
    answer: "Most clients don't realize they're speaking with an AI. Our technology creates natural, conversational interactions that mirror your team's communication style. However, we always maintain transparency and the AI will identify itself if directly asked."
  },
  {
    question: "What booking systems do you integrate with?",
    answer: "We integrate with all major salon and spa booking platforms including Fresha, Acuity, Mindbody, Vagaro, Square Appointments, and many others. If you use a custom system, our team can typically create a custom integration within 24-48 hours."
  },
  {
    question: "How much does BookMySalon cost?",
    answer: "Our pricing starts at $199/month for small salons and scales based on your call volume and features needed. Most clients see a return on investment within the first week. We offer a 14-day free trial with no setup fees."
  },
  {
    question: "Can the AI handle multiple languages?",
    answer: "Yes, our AI supports English, Spanish, French, German, Italian, and Portuguese. It automatically detects the caller's language and responds accordingly. We're continuously adding support for additional languages based on customer demand."
  },
  {
    question: "What if I already have a receptionist?",
    answer: "BookMySalon complements your existing team by handling overflow calls, after-hours inquiries, and busy period bookings. Your team can focus on in-person clients while our AI ensures no phone opportunity is missed. Many clients use us as their primary phone system and redeploy their receptionist to customer service and upselling."
  },
  {
    question: "Is my client data secure?",
    answer: "Absolutely. We use enterprise-grade encryption, are fully HIPAA compliant, and store all data in secure, SOC 2 certified data centers. Client information is never shared with third parties and we maintain strict access controls and audit logs."
  },
  {
    question: "Can I customize what the AI says?",
    answer: "Yes, the AI can be fully customized to match your brand voice, service descriptions, pricing, and policies. You can update the AI's knowledge base anytime through our simple dashboard, and changes take effect immediately."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
            <HelpCircle className="w-4 h-4 text-foreground mr-2" />
            <span className="text-sm text-foreground font-medium">Frequently Asked Questions</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Know
          </h2>
          
          <p className="text-xl text-muted-foreground">
            Get answers to the most common questions about BookMySalon
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card 
              key={index}
              className="card-glow border-border/50 hover:border-primary/30 transition-all duration-300"
              data-testid={`faq-item-${index}`}
            >
              <CardHeader
                className="cursor-pointer hover-elevate"
                onClick={() => toggleItem(index)}
                data-testid={`faq-question-${index}`}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground text-left pr-4">
                    {faq.question}
                  </CardTitle>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              
              {openItems.includes(index) && (
                <CardContent className="pt-0 fade-in" data-testid={`faq-answer-${index}`}>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </CardDescription>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent className="py-8 px-8">
              <h3 className="text-xl font-bold text-foreground mb-4">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-6">
                Our team is here to help you get started with BookMySalon
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:hello@bookmysalon.tech"
                  className="text-primary hover:text-primary/80 font-medium"
                  data-testid="link-contact-email"
                >
                  📧 hello@bookmysalon.tech
                </a>
                <span className="hidden sm:inline text-muted-foreground">|</span>
                <span className="text-muted-foreground">
                  💬 Live chat available 9AM-6PM PST
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}