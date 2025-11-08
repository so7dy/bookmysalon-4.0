import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Phone, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForwardingInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}

const carrierInstructions = {
  verizon: {
    name: 'Verizon',
    steps: [
      'Dial *72 from your business phone',
      'Wait for the dial tone',
      'Enter the AI receptionist phone number',
      'Wait for confirmation tone or message',
      'Hang up - call forwarding is now active',
    ],
    deactivate: 'Dial *73 to turn off call forwarding',
  },
  att: {
    name: 'AT&T',
    steps: [
      'Dial *21* followed by the AI receptionist phone number and then # (e.g., *21*18001234567#)',
      'Press the call button',
      'Wait for confirmation message',
      'Hang up - call forwarding is now active',
    ],
    deactivate: 'Dial #21# to turn off call forwarding',
  },
  tmobile: {
    name: 'T-Mobile',
    steps: [
      'Dial **21* followed by the AI receptionist phone number and then # (e.g., **21*18001234567#)',
      'Press the call button',
      'Wait for confirmation message',
      'Hang up - call forwarding is now active',
    ],
    deactivate: 'Dial ##21# to turn off call forwarding',
  },
  sprint: {
    name: 'Sprint',
    steps: [
      'Dial *72 from your business phone',
      'Wait for the dial tone',
      'Enter the AI receptionist phone number',
      'Wait for confirmation',
      'Hang up - call forwarding is now active',
    ],
    deactivate: 'Dial *720 to turn off call forwarding',
  },
  rogers: {
    name: 'Rogers (Canada)',
    steps: [
      'Dial *21 from your business phone',
      'Wait for the tone',
      'Enter the AI receptionist phone number',
      'Press #',
      'Wait for confirmation - call forwarding is now active',
    ],
    deactivate: 'Dial #21# to turn off call forwarding',
  },
  bell: {
    name: 'Bell (Canada)',
    steps: [
      'Dial *21 from your business phone',
      'Enter the AI receptionist phone number',
      'Press #',
      'Wait for confirmation message',
      'Hang up - call forwarding is now active',
    ],
    deactivate: 'Dial #21# to turn off call forwarding',
  },
  telus: {
    name: 'Telus (Canada)',
    steps: [
      'Dial *21* followed by the AI receptionist phone number and then # (e.g., *21*18001234567#)',
      'Press the call button',
      'Wait for confirmation',
      'Hang up - call forwarding is now active',
    ],
    deactivate: 'Dial #21# to turn off call forwarding',
  },
};

export function ForwardingInstructionsModal({
  isOpen,
  onClose,
  phoneNumber,
}: ForwardingInstructionsModalProps) {
  const { toast } = useToast();
  const [selectedCarrier, setSelectedCarrier] = useState<keyof typeof carrierInstructions>('verizon');

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    toast({
      title: 'Phone number copied',
      description: 'AI receptionist number copied to clipboard',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="dialog-forwarding-instructions">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Call Forwarding Setup
          </DialogTitle>
          <DialogDescription>
            Forward calls from your business number to your AI receptionist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Phone Number Display */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI Receptionist Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <span className="flex-1 font-mono text-lg" data-testid="text-ai-phone-number">{phoneNumber}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPhone}
                  data-testid="button-copy-phone-forwarding"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Carrier Selection */}
          <div className="space-y-3">
            <h4 className="font-medium">Select Your Carrier</h4>
            <Tabs value={selectedCarrier} onValueChange={(v) => setSelectedCarrier(v as keyof typeof carrierInstructions)}>
              <TabsList className="grid grid-cols-4 gap-1">
                <TabsTrigger value="verizon" data-testid="tab-verizon">Verizon</TabsTrigger>
                <TabsTrigger value="att" data-testid="tab-att">AT&T</TabsTrigger>
                <TabsTrigger value="tmobile" data-testid="tab-tmobile">T-Mobile</TabsTrigger>
                <TabsTrigger value="sprint" data-testid="tab-sprint">Sprint</TabsTrigger>
              </TabsList>
              <TabsList className="grid grid-cols-3 gap-1 mt-2">
                <TabsTrigger value="rogers" data-testid="tab-rogers">Rogers</TabsTrigger>
                <TabsTrigger value="bell" data-testid="tab-bell">Bell</TabsTrigger>
                <TabsTrigger value="telus" data-testid="tab-telus">Telus</TabsTrigger>
              </TabsList>

              {Object.entries(carrierInstructions).map(([key, carrier]) => (
                <TabsContent key={key} value={key} className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {carrier.name} Setup Instructions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Steps to activate:</p>
                        <ol className="space-y-2 ml-4">
                          {carrier.steps.map((step, index) => (
                            <li key={index} className="flex gap-3 text-sm">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                                {index + 1}
                              </span>
                              <span className="flex-1 pt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">To deactivate:</p>
                        <p className="text-sm text-muted-foreground">{carrier.deactivate}</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Important Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Call forwarding must be set up from the phone you want to forward</li>
                <li>Your carrier may charge for call forwarding services - check your plan</li>
                <li>Test the forwarding by calling your business number from another phone</li>
                <li>You can disable forwarding at any time using the deactivation code</li>
                <li>If you have issues, contact your carrier's customer support</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} data-testid="button-close-forwarding">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
