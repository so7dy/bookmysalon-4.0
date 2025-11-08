import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mic2, Play, Loader2, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AISettingsProps {
  savedData?: {
    voiceChoice?: string;
    greetingMessage?: string;
  };
  onComplete: (data: FormData) => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  voiceChoice: z.enum(['Brian', 'Anna'], {
    required_error: 'Please select a voice',
  }),
  greetingMessage: z.string().min(10, 'Greeting must be at least 10 characters').max(500, 'Greeting must be less than 500 characters'),
});

type FormData = z.infer<typeof formSchema>;

const VOICE_OPTIONS = [
  {
    id: 'Brian',
    name: 'Brian',
    description: 'Professional male voice',
    gender: 'Male',
    sampleUrl: 'https://retell-utils.s3.us-west-2.amazonaws.com/voice_samples/Brian.mp3',
  },
  {
    id: 'Anna',
    name: 'Anna',
    description: 'Friendly female voice',
    gender: 'Female',
    sampleUrl: 'https://retell-utils.s3.us-west-2.amazonaws.com/voice_samples/Anna.mp3',
  },
];

const DEFAULT_GREETING = "Thank you for calling! I'm your AI receptionist. How can I help you schedule an appointment today?";

export function AISettings({ savedData, onComplete, isLoading }: AISettingsProps) {
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voiceChoice: 'Brian',
      greetingMessage: DEFAULT_GREETING,
    },
  });

  // Hydrate form with saved data
  useEffect(() => {
    if (savedData) {
      const formData = {
        voiceChoice: (savedData.voiceChoice as 'Brian' | 'Anna') || 'Brian',
        greetingMessage: savedData.greetingMessage || DEFAULT_GREETING,
      };
      form.reset(formData);
    }
  }, [savedData, form]);

  const handlePlaySample = async (voiceId: string, sampleUrl: string) => {
    try {
      setPlayingVoice(voiceId);
      const audio = new Audio(sampleUrl);
      
      audio.onended = () => {
        setPlayingVoice(null);
      };
      
      audio.onerror = () => {
        setPlayingVoice(null);
        console.error('Failed to play audio sample');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingVoice(null);
    }
  };

  const onSubmit = (data: FormData) => {
    onComplete(data);
  };

  const selectedVoice = form.watch('voiceChoice');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mic2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-2xl font-semibold">AI Voice Settings</h2>
          <p className="text-sm text-muted-foreground">
            Customize how your AI receptionist sounds and greets callers
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Voice Selection</CardTitle>
              <CardDescription>
                Choose the voice that best represents your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="voiceChoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Voice</FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {VOICE_OPTIONS.map((voice) => (
                        <div
                          key={voice.id}
                          onClick={() => field.onChange(voice.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover-elevate ${
                            selectedVoice === voice.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border'
                          }`}
                          data-testid={`voice-option-${voice.id.toLowerCase()}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{voice.name}</h3>
                              <p className="text-sm text-muted-foreground">{voice.description}</p>
                              <p className="text-xs text-muted-foreground mt-1">{voice.gender}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {selectedVoice === voice.id && (
                                <div className="h-2 w-2 rounded-full bg-primary" data-testid={`selected-${voice.id.toLowerCase()}`} />
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySample(voice.id, voice.sampleUrl);
                            }}
                            disabled={playingVoice === voice.id}
                            className="w-full"
                            data-testid={`button-play-${voice.id.toLowerCase()}`}
                          >
                            {playingVoice === voice.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Playing...
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Play Sample
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Greeting Message</CardTitle>
              <CardDescription>
                This is the first thing callers will hear
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="greetingMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Greeting</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter your greeting message..."
                        rows={4}
                        data-testid="input-greeting-message"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value.length}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Keep it friendly and concise. The AI will use this greeting to start every call.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isLoading}
              data-testid="button-continue"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
