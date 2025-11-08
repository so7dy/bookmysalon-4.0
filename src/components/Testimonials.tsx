import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Owner, Luxe Beauty Salon",
    location: "San Francisco, CA",
    content: "FutureAI has been a game-changer for my salon. We were losing at least 20 appointments a week from missed calls. Now our AI assistant captures every single one. Our revenue increased by $15,000 in the first month alone.",
    rating: 5,
    initials: "SC",
    revenue: "+$15K/month"
  },
  {
    name: "Marcus Rodriguez",
    role: "Co-owner, The Gentleman's Cut", 
    location: "Austin, TX",
    content: "The AI sounds so natural that clients can't tell it's not human. It books appointments, answers questions about our services, and even handles rescheduling. It's like having a perfect receptionist that never takes a break.",
    rating: 5,
    initials: "MR",
    revenue: "+$22K/month"
  },
  {
    name: "Jennifer Kim",
    role: "Manager, Bella Vista Spa",
    location: "Miami, FL", 
    content: "I was skeptical at first, but the results speak for themselves. Our booking rate went from 60% to 95% overnight. The AI even upsells our premium services better than our human staff sometimes!",
    rating: 5,
    initials: "JK",
    revenue: "+$31K/month"
  },
  {
    name: "David Thompson",
    role: "Owner, Classic Cuts Barbershop",
    location: "Chicago, IL",
    content: "Best investment I've made for my business. The setup was incredibly easy, and within a week, we saw a massive improvement in our booking rates. Our customers love the instant response time.",
    rating: 5,
    initials: "DT",
    revenue: "+$18K/month"
  },
  {
    name: "Amanda Foster",
    role: "Director, Serenity Day Spa",
    location: "Los Angeles, CA",
    content: "What impressed me most is how the AI learns our specific language and policies. It handles complex scheduling scenarios perfectly and maintains our brand voice in every interaction.",
    rating: 5,
    initials: "AF",
    revenue: "+$28K/month"
  },
  {
    name: "Roberto Silva",
    role: "Owner, Elite Hair Studio",
    location: "Phoenix, AZ",
    content: "The ROI analytics are incredible. I can see exactly how much revenue the AI is generating. It's paid for itself 10 times over in just three months. My only regret is not starting sooner.",
    rating: 5,
    initials: "RS",
    revenue: "+$35K/month"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
            <Star className="w-4 h-4 text-foreground mr-2" />
            <span className="text-sm text-foreground font-medium">Customer Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real Results from Real Businesses
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how salon and barbershop owners are transforming their missed calls into booked appointments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className={`card-glow border-border/50 hover:border-primary/30 transition-all duration-300 fade-in-delay-${index % 3 === 0 ? '1' : index % 3 === 1 ? '2' : '1'}`}
              data-testid={`card-testimonial-${testimonial.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/30" />
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    "{testimonial.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12 border-2 border-primary/20 glow-primary">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {testimonial.revenue}
                    </div>
                    <div className="text-xs text-muted-foreground">Revenue Gain</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 max-w-4xl mx-auto">
            <CardContent className="py-8 px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">4.9/5</div>
                  <div className="text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">2,500+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">973%</div>
                  <div className="text-muted-foreground">Average ROI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}