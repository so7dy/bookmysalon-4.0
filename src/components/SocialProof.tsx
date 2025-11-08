import { Star, Users, Calendar, PhoneCall } from 'lucide-react';

export default function SocialProof() {
  return (
    <section className="py-12 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="text-center" data-testid="stat-salons">
            <div className="flex justify-center mb-2">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">500+</div>
            <div className="text-sm text-muted-foreground">Salons & Barbershops</div>
          </div>
          
          <div className="text-center" data-testid="stat-bookings">
            <div className="flex justify-center mb-2">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">50K+</div>
            <div className="text-sm text-muted-foreground">Appointments Booked</div>
          </div>
          
          <div className="text-center" data-testid="stat-calls">
            <div className="flex justify-center mb-2">
              <PhoneCall className="h-8 w-8 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">24/7</div>
            <div className="text-sm text-muted-foreground">AI Receptionist</div>
          </div>
          
          <div className="text-center" data-testid="stat-rating">
            <div className="flex justify-center mb-2 gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
            </div>
            <div className="text-3xl font-bold text-foreground">4.9/5</div>
            <div className="text-sm text-muted-foreground">Customer Rating</div>
          </div>
        </div>

        {/* Trusted By */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by leading salons and barbershops worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold">The Cut Studio</div>
            <div className="text-lg font-semibold">Elite Barbershop</div>
            <div className="text-lg font-semibold">Luxe Hair Salon</div>
            <div className="text-lg font-semibold">Modern Cuts</div>
          </div>
        </div>
      </div>
    </section>
  );
}
