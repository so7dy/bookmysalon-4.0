import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Search, BookOpen, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
    tags: ["AI", "Customer Service", "Technology"]
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
    tags: ["Revenue", "Business", "ROI"]
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
    tags: ["Management", "Automation", "Efficiency"]
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
    tags: ["Scheduling", "Revenue", "Barbershop"]
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
    tags: ["Retention", "Loyalty", "Client Service"]
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
    tags: ["Future", "Trends", "Operations"]
  }
];

const categories = ["All", "AI Technology", "Business Strategy", "Salon Management", "Barbershop Tips", "Client Relations", "Industry Trends"];

export default function Blog() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
              <BookOpen className="w-4 h-4 text-foreground mr-2" />
              <span className="text-sm text-foreground font-medium">Industry Insights</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text-static">
              Salon & Barbershop Blog
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Expert insights on AI technology, business strategies, and industry trends for beauty professionals.
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={selectedCategory === category ? "glow-primary" : ""}
                    data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                Featured Articles
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="card-glow border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10 hover:scale-[1.02] transition-transform duration-300"
                    data-testid={`card-featured-post-${post.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-foreground hover:text-primary transition-colors cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.category}</span>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.readTime}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" className="w-full" data-testid={`button-read-${post.id}`}>
                          Read Article
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center">
              <BookOpen className="w-6 h-6 mr-2 text-primary" />
              Latest Articles
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className={`card-glow border-border/50 hover:border-primary/30 transition-all duration-300 fade-in-delay-${index % 3 === 0 ? '1' : index % 3 === 1 ? '2' : '1'}`}
                  data-testid={`card-post-${post.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-foreground hover:text-primary transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="outline" className="w-full" data-testid={`button-read-${post.id}`}>
                        Read Article
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or category filter
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-16 bg-card/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="py-12">
                <Zap className="w-16 h-16 text-primary mx-auto mb-6 glow-primary" />
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Stay Updated
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Get the latest insights on AI technology, business strategies, and industry trends delivered to your inbox.
                </p>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newsletterEmail) {
                    toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
                    return;
                  }
                  setIsSubscribing(true);
                  try {
                    await apiRequest("POST", "/api/subscribe", { email: newsletterEmail });
                    toast({ title: "Success!", description: "Successfully subscribed to our newsletter!" });
                    setNewsletterEmail("");
                  } catch (error) {
                    toast({ title: "Error", description: "Failed to subscribe. Please try again.", variant: "destructive" });
                  } finally {
                    setIsSubscribing(false);
                  }
                }} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input 
                    placeholder="Enter your email"
                    type="email"
                    className="flex-1"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    data-testid="input-newsletter-email"
                  />
                  <Button type="submit" className="glow-primary" disabled={isSubscribing} data-testid="button-subscribe">
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-xl font-bold text-foreground font-mono">BookMySalon</span>
                <img src="/logo.svg" alt="BookMySalon Logo" className="w-10 h-10" />
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Transform your salon or barbershop with AI-powered call handling that never misses an opportunity.
              </p>
              <div className="text-sm text-muted-foreground">
                © 2025 BookMySalon. All rights reserved. <br />
                Contact us: <a href="mailto:hello@bookmysalon.tech" className="text-primary hover:text-primary/80">hello@bookmysalon.tech</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/#features" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="/#roi-calculator" className="hover:text-primary transition-colors">ROI Calculator</a></li>
                <li><a href="/#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="/#demo" className="hover:text-primary transition-colors">Demo</a></li>
              </ul>
            </div>
            
            <div>
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