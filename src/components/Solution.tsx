import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Phone, Sparkles } from 'lucide-react';

export default function Solution() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            See It In Action
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your AI Receptionist Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional dashboard with real-time insights, call management, and seamless calendar integration
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative" data-testid="dashboard-mockup">
          <Card className="p-1 bg-gradient-to-br from-primary/20 to-purple-500/20 border-primary/20">
            <div className="bg-card rounded-lg overflow-hidden">
              {/* Dashboard Header */}
              <div className="border-b border-border p-4 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">dashboard.bookmysalon.tech</div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Stat Cards */}
                  <Card className="p-6" data-testid="card-calls">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-muted-foreground">Total Calls</div>
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">342</div>
                    <div className="text-sm text-green-500 mt-1">↑ 23% this week</div>
                  </Card>

                  <Card className="p-6" data-testid="card-bookings">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-muted-foreground">Bookings</div>
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">289</div>
                    <div className="text-sm text-green-500 mt-1">↑ 18% this week</div>
                  </Card>

                  <Card className="p-6" data-testid="card-conversion">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-muted-foreground">Conversion</div>
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">84.5%</div>
                    <div className="text-sm text-green-500 mt-1">↑ 5% this week</div>
                  </Card>
                </div>

                {/* Calendar Preview */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-foreground">Upcoming Appointments</h3>
                    <Badge variant="default">Today</Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      { time: '10:00 AM', service: 'Classic Cut', client: 'John Smith' },
                      { time: '11:30 AM', service: 'Hair Coloring', client: 'Sarah Johnson' },
                      { time: '2:00 PM', service: 'Beard Trim', client: 'Mike Davis' },
                    ].map((appt, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                        <div className="text-sm font-medium text-primary">{appt.time}</div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{appt.service}</div>
                          <div className="text-sm text-muted-foreground">{appt.client}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </Card>

          {/* Floating Badge */}
          <div className="absolute -top-6 -right-6 hidden md:block">
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg font-semibold">
              Real-time calendar sync
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
