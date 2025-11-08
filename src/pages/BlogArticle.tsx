import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    slug: "ai-revolutionizing-salon-customer-service",
    title: "How AI is Revolutionizing Salon Customer Service",
    excerpt: "Discover how artificial intelligence is transforming the way salons interact with clients, from booking appointments to providing personalized recommendations.",
    category: "AI Technology",
    readTime: "5 min read",
    date: "December 15, 2024",
    featured: true,
    tags: ["AI", "Customer Service", "Technology"],
    content: `
      <p>The beauty industry is experiencing a digital transformation, and artificial intelligence is at the forefront of this revolution. Salons and barbershops that embrace AI-powered customer service are seeing remarkable improvements in client satisfaction, appointment booking rates, and overall business efficiency.</p>
      
      <h2>The Challenge of Traditional Customer Service</h2>
      <p>Many salon owners struggle with missed calls, double-bookings, and the constant interruption of work to answer phone calls. This not only affects service quality but also leads to lost revenue opportunities. Studies show that up to 40% of calls to small beauty businesses go unanswered during peak hours.</p>
      
      <h2>How AI Transforms Client Interactions</h2>
      <p>AI-powered phone systems can handle multiple calls simultaneously, never miss an appointment opportunity, and provide consistent, professional service 24/7. These systems learn from every interaction, continuously improving their ability to understand client needs and preferences.</p>
      
      <h3>Key Benefits Include:</h3>
      <ul>
        <li>Instant appointment booking without staff interruption</li>
        <li>Personalized service recommendations based on client history</li>
        <li>Automated follow-ups and reminders to reduce no-shows</li>
        <li>Multi-language support for diverse clientele</li>
        <li>Real-time availability updates across all booking channels</li>
      </ul>
      
      <h2>Real-World Results</h2>
      <p>Salons implementing AI customer service report an average 35% increase in successful bookings and a 50% reduction in no-show rates. The technology pays for itself within the first month for most businesses.</p>
      
      <h2>The Future is Here</h2>
      <p>As AI technology continues to advance, we'll see even more innovative applications in the beauty industry. From virtual consultations to predictive inventory management, the possibilities are endless. The question isn't whether to adopt AI, but how quickly you can integrate it into your business.</p>
    `
  },
  {
    id: 2,
    slug: "hidden-cost-missed-calls-beauty-businesses",
    title: "The Hidden Cost of Missed Calls in Beauty Businesses",
    excerpt: "A deep dive into the revenue impact of missed calls and how salon owners can calculate their potential losses from unanswered phone calls.",
    category: "Business Strategy",
    readTime: "7 min read",
    date: "December 12, 2024",
    featured: true,
    tags: ["Revenue", "Business", "ROI"],
    content: `
      <p>Every missed call represents a potential client walking away from your business. For beauty businesses, the financial impact of unanswered calls is often severely underestimated.</p>
      
      <h2>The Mathematics of Missed Opportunities</h2>
      <p>Let's break down the real cost: If your salon receives 20 calls per day and misses just 5 of them, that's 150 missed calls per month. If your average service value is $65 and your conversion rate is 60%, you're losing approximately $5,850 in monthly revenue.</p>
      
      <h3>Factors That Compound the Loss:</h3>
      <ul>
        <li>Lifetime client value - each missed call could mean losing years of repeat business</li>
        <li>Referral impact - satisfied clients typically refer 2-3 new customers annually</li>
        <li>Competitive disadvantage - those callers are likely booking with competitors who answer</li>
        <li>Brand perception - unanswered calls create an impression of unprofessionalism</li>
      </ul>
      
      <h2>Peak Hour Problem</h2>
      <p>Most missed calls occur during your busiest hours - precisely when you can't afford to lose business. This creates a paradox where success leads to more missed opportunities.</p>
      
      <h2>The Solution: Automated Call Handling</h2>
      <p>Modern AI systems can capture every opportunity without requiring additional staff. They work tirelessly during peak hours, after closing, and even on holidays. The ROI is immediate and measurable.</p>
      
      <h2>Case Study: Mid-Size Salon</h2>
      <p>A salon with 3 stylists implemented AI call handling and saw their monthly revenue increase by $8,400 within 30 days. The system paid for itself in the first week and continues to generate positive returns month after month.</p>
    `
  },
  {
    id: 3,
    slug: "five-signs-salon-needs-ai-phone-assistant",
    title: "5 Signs Your Salon Needs an AI Phone Assistant",
    excerpt: "Learn the key indicators that suggest your salon could benefit from automated call handling and appointment booking systems.",
    category: "Salon Management",
    readTime: "4 min read",
    date: "December 10, 2024",
    featured: false,
    tags: ["Management", "Automation", "Efficiency"],
    content: `
      <p>Not sure if your salon is ready for AI-powered call handling? Here are five clear signs that indicate it's time to make the switch.</p>
      
      <h2>1. You're Constantly Interrupted During Services</h2>
      <p>If you or your staff are regularly stopping mid-service to answer the phone, you're not only compromising service quality but also frustrating clients who are paying for your full attention.</p>
      
      <h2>2. Voicemail Full of Unreturned Messages</h2>
      <p>A backlog of voicemails means missed bookings and frustrated potential clients. By the time you call back, they've likely booked elsewhere.</p>
      
      <h2>3. Double Bookings and Scheduling Conflicts</h2>
      <p>Manual scheduling during busy periods often leads to errors. These mistakes damage your reputation and create stressful situations for staff and clients.</p>
      
      <h2>4. After-Hours Calls Going Straight to Voicemail</h2>
      <p>Many clients prefer to book appointments outside business hours. Missing these calls means losing business to competitors with 24/7 booking options.</p>
      
      <h2>5. Revenue Plateaus Despite Demand</h2>
      <p>If you're consistently busy but not seeing revenue growth, you might be at capacity for handling calls manually. AI can help you scale without hiring additional staff.</p>
      
      <h2>The Bottom Line</h2>
      <p>If you recognized your salon in two or more of these scenarios, an AI phone assistant could significantly improve your operations and boost revenue. The technology is more accessible and affordable than ever before.</p>
    `
  },
  {
    id: 4,
    slug: "maximizing-barbershop-revenue-smart-scheduling",
    title: "Maximizing Barbershop Revenue with Smart Scheduling",
    excerpt: "Strategies for optimizing appointment schedules, reducing no-shows, and increasing average transaction values through intelligent booking.",
    category: "Barbershop Tips",
    readTime: "6 min read",
    date: "December 8, 2024",
    featured: false,
    tags: ["Scheduling", "Revenue", "Barbershop"],
    content: `
      <p>Smart scheduling is the foundation of a profitable barbershop. By optimizing how you manage appointments, you can increase revenue without working longer hours.</p>
      
      <h2>Dynamic Scheduling Strategies</h2>
      <p>Traditional fixed-interval scheduling leaves money on the table. Different services require different time allocations, and smart systems can automatically optimize your schedule.</p>
      
      <h3>Key Optimization Techniques:</h3>
      <ul>
        <li>Service-based time blocking for maximum efficiency</li>
        <li>Buffer time management to prevent schedule overruns</li>
        <li>Peak pricing during high-demand hours</li>
        <li>Fill-in slots for quick services</li>
        <li>Preferred client time slots for regulars</li>
      </ul>
      
      <h2>Reducing No-Shows</h2>
      <p>No-shows can cost barbershops up to 20% of potential revenue. Automated reminders via SMS and email can reduce no-show rates by up to 60%.</p>
      
      <h2>Upselling Through Smart Booking</h2>
      <p>AI systems can suggest complementary services during the booking process, increasing average transaction values by 25-30%.</p>
      
      <h2>Data-Driven Decisions</h2>
      <p>Modern scheduling systems provide insights into peak hours, popular services, and client preferences. Use this data to make informed staffing and pricing decisions.</p>
    `
  },
  {
    id: 5,
    slug: "client-retention-strategies-modern-salons",
    title: "Client Retention Strategies for Modern Salons",
    excerpt: "Proven techniques for keeping clients coming back, including follow-up strategies, loyalty programs, and personalized service approaches.",
    category: "Client Relations",
    readTime: "8 min read",
    date: "December 5, 2024",
    featured: false,
    tags: ["Retention", "Loyalty", "Client Service"],
    content: `
      <p>Acquiring new clients is expensive. Retaining existing ones is the key to sustainable, profitable growth in the beauty industry.</p>
      
      <h2>The Power of Personalization</h2>
      <p>Modern AI systems can track client preferences, service history, and even special occasions, allowing you to provide truly personalized experiences.</p>
      
      <h3>Personalization Strategies:</h3>
      <ul>
        <li>Birthday and anniversary reminders with special offers</li>
        <li>Preferred stylist and time slot recommendations</li>
        <li>Product recommendations based on service history</li>
        <li>Customized service packages for regular clients</li>
      </ul>
      
      <h2>Automated Follow-Up Systems</h2>
      <p>Consistent communication keeps your salon top-of-mind. Automated systems can send thank-you messages, request feedback, and schedule next appointments.</p>
      
      <h2>Loyalty Programs That Work</h2>
      <p>Digital loyalty programs integrated with your booking system make it easy for clients to track rewards and redeem benefits.</p>
      
      <h2>Handling Complaints Professionally</h2>
      <p>AI systems can flag potential issues early, allowing you to address concerns before they become bigger problems.</p>
      
      <h2>The Retention ROI</h2>
      <p>Increasing client retention by just 5% can increase profits by 25-95%. The investment in retention technology pays dividends far beyond the initial cost.</p>
    `
  },
  {
    id: 6,
    slug: "future-beauty-business-operations",
    title: "The Future of Beauty Business Operations",
    excerpt: "Exploring emerging trends in salon and barbershop management, from AI-powered analytics to automated marketing campaigns.",
    category: "Industry Trends",
    readTime: "10 min read",
    date: "December 3, 2024",
    featured: false,
    tags: ["Future", "Trends", "Operations"],
    content: `
      <p>The beauty industry is on the cusp of a technological revolution. Here's what forward-thinking salon owners need to know about the future of operations.</p>
      
      <h2>AI-Powered Business Intelligence</h2>
      <p>Next-generation systems will provide predictive analytics, helping you anticipate demand, optimize inventory, and make data-driven decisions about everything from pricing to staffing.</p>
      
      <h2>Hyper-Personalized Client Experiences</h2>
      <p>AI will enable truly individualized service recommendations, pricing, and marketing - all while maintaining the human touch that makes beauty businesses special.</p>
      
      <h2>Automated Marketing Campaigns</h2>
      <p>Smart systems will manage your entire marketing funnel, from social media to email campaigns, optimizing for maximum engagement and ROI.</p>
      
      <h2>Integration Ecosystems</h2>
      <p>Future systems will seamlessly integrate booking, payment processing, inventory management, and marketing - all from a single platform.</p>
      
      <h2>Virtual Consultations</h2>
      <p>AI-powered virtual consultations will allow clients to explore options and get recommendations before their in-person appointments.</p>
      
      <h2>Sustainability and Efficiency</h2>
      <p>Smart systems will help salons reduce waste, optimize resource usage, and operate more sustainably - good for business and the planet.</p>
      
      <h2>Preparing for the Future</h2>
      <p>The time to adopt these technologies is now. Early adopters will gain competitive advantages that compound over time. The future of beauty business is automated, intelligent, and incredibly exciting.</p>
    `
  }
];

export default function BlogArticle() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div>
          <Navigation 
            isLoggedIn={isLoggedIn}
            onLogin={() => setIsLoggedIn(true)}
            onLogout={() => setIsLoggedIn(false)}
          />
        </div>
        <main className="pt-20 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" className="mb-6" data-testid="button-back-to-blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="bg-primary text-primary-foreground">{post.category}</Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                {post.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text-static" data-testid="text-article-title">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground mb-8">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between border-y border-border py-4 mb-8">
              <Button variant="outline" size="sm" data-testid="button-share">
                <Share2 className="w-4 h-4 mr-2" />
                Share Article
              </Button>
            </div>
          </div>

          <Card className="card-glow border-border/50">
            <CardContent className="p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-foreground prose-headings:font-bold
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-ul:text-muted-foreground prose-ul:my-6
                  prose-li:mb-2
                  prose-strong:text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
                data-testid="content-article-body"
              />
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">
                  Ready to Transform Your Salon?
                </CardTitle>
                <CardDescription className="text-lg">
                  See how AI-powered call handling can boost your revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/#roi-calculator">
                  <Button className="glow-primary" size="lg" data-testid="button-cta">
                    Calculate Your ROI
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </article>
      </main>

      <footer className="bg-card border-t border-border py-12 mt-16">
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
