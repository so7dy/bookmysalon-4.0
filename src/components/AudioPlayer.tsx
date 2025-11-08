import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Volume2, Download, Phone, Calendar } from "lucide-react";
import demoAudioFile from "@assets/demo_1759186778615.mp3";

interface AudioDemo {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: "booking" | "rescheduling" | "inquiry";
  audioSrc?: string;
}

const demoAudios: AudioDemo[] = [
  {
    id: "booking-demo",
    title: "New Appointment Booking",
    description: "Listen to how our AI handles a real client booking a haircut appointment. Notice the natural conversation flow, professional tone, and how it captures all necessary details seamlessly.",
    duration: "2:15",
    type: "booking",
    audioSrc: demoAudioFile
  }
];

interface AudioPlayerProps {
  onDownloadDemo?: (demoId: string) => void;
}

export default function AudioPlayer({ onDownloadDemo }: AudioPlayerProps) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ [key: string]: number }>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  // Initialize audio elements
  useEffect(() => {
    demoAudios.forEach(demo => {
      if (demo.audioSrc && !audioRefs.current[demo.id]) {
        const audio = new Audio(demo.audioSrc);
        audioRefs.current[demo.id] = audio;
        
        // Update progress during playback
        audio.addEventListener('timeupdate', () => {
          if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            setProgress(prev => ({ ...prev, [demo.id]: progressPercent }));
          }
        });
        
        // Handle audio end
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentlyPlaying(null);
          setProgress(prev => ({ ...prev, [demo.id]: 0 }));
        });
      }
    });

    // Cleanup
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  const handlePlayPause = (demoId: string) => {
    const audio = audioRefs.current[demoId];
    if (!audio) return;
    
    // Pause any currently playing audio
    if (currentlyPlaying && currentlyPlaying !== demoId) {
      const currentAudio = audioRefs.current[currentlyPlaying];
      if (currentAudio) {
        currentAudio.pause();
      }
    }
    
    if (currentlyPlaying === demoId && isPlaying) {
      // Pause current
      audio.pause();
      setIsPlaying(false);
    } else {
      // Play new or resume
      audio.play();
      setCurrentlyPlaying(demoId);
      setIsPlaying(true);
    }
  };

  const handleDownload = (demoId: string) => {
    const demo = demoAudios.find(d => d.id === demoId);
    if (demo?.audioSrc) {
      const link = document.createElement('a');
      link.href = demo.audioSrc;
      link.download = `${demo.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    onDownloadDemo?.(demoId);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "booking": return <Calendar className="w-12 h-12 text-primary mx-auto glow-primary" />;
      case "rescheduling": return <Calendar className="w-12 h-12 text-primary mx-auto glow-primary" />;
      case "inquiry": return <Phone className="w-12 h-12 text-primary mx-auto glow-primary" />;
      default: return <Phone className="w-12 h-12 text-primary mx-auto glow-primary" />;
    }
  };

  return (
    <section id="demo" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20 glow-primary mb-6">
            <Phone className="w-4 h-4 text-foreground mr-2" />
            <span className="text-sm text-foreground font-medium">Live Demos</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Hear Our AI in Action
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Listen to real conversations between our AI and clients. Notice how natural and professional every interaction sounds.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {demoAudios.map((demo, index) => (
            <Card 
              key={demo.id}
              className="card-glow border-border/50 hover:border-primary/30 transition-all duration-300"
              data-testid={`card-audio-demo-${demo.id}`}
            >
              <CardHeader className="text-center pb-4">
                <div className="mb-4">{getIconForType(demo.type)}</div>
                <CardTitle className="text-lg text-foreground mb-2">{demo.title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                  {demo.description}
                </CardDescription>
                <div className="text-xs text-primary font-medium mt-2">
                  Duration: {demo.duration}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-200 glow-primary"
                    style={{ width: `${progress[demo.id] || 0}%` }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <Button
                    size="lg"
                    variant={currentlyPlaying === demo.id && isPlaying ? "default" : "outline"}
                    className={`flex-1 mr-3 ${currentlyPlaying === demo.id && isPlaying ? 'glow-primary' : ''}`}
                    onClick={() => handlePlayPause(demo.id)}
                    data-testid={`button-play-${demo.id}`}
                  >
                    {currentlyPlaying === demo.id && isPlaying ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {currentlyPlaying === demo.id && isPlaying ? 'Pause' : 'Play'}
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover-elevate"
                    onClick={() => handleDownload(demo.id)}
                    data-testid={`button-download-${demo.id}`}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>

                {/* Volume Indicator */}
                {currentlyPlaying === demo.id && isPlaying && (
                  <div className="flex items-center justify-center mt-4 text-xs text-muted-foreground">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Playing...
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="card-glow border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 max-w-4xl mx-auto">
            <CardContent className="py-8 px-8">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Custom Voice Training Available
              </h3>
              <p className="text-muted-foreground mb-6">
                Want your AI to sound exactly like your team? We can train custom voices that match your brand personality and speaking style.
              </p>
              <a href="/contact">
                <Button className="glow-primary" data-testid="button-custom-voice">
                  Learn About Custom Voices
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}