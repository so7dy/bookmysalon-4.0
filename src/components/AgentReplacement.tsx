import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface AgentReplacementProps {
  currentAgentId?: string;
  phoneNumber?: string;
  onSuccess?: () => void;
}

interface ReplacementResult {
  success: boolean;
  message: string;
  oldAgentId: string;
  newAgentId: string;
  phoneNumber: string;
  formattedPhoneNumber: string;
  agentType: string;
  masterLlmId: string;
}

export default function AgentReplacement({ 
  currentAgentId, 
  phoneNumber,
  onSuccess 
}: AgentReplacementProps) {
  const { toast } = useToast();
  const [replacementResult, setReplacementResult] = useState<ReplacementResult | null>(null);

  const replaceMutation = useMutation({
    mutationFn: async (): Promise<ReplacementResult> => {
      const response = await apiRequest('POST', '/api/receptionist/replace-agent', {});
      return await response.json();
    },
    onSuccess: (data: ReplacementResult) => {
      setReplacementResult(data);
      toast({
        title: 'Success!',
        description: 'Agent replaced successfully with Master LLM',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/receptionist/status'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to replace agent',
        variant: 'destructive',
      });
    },
  });

  return (
    <Card data-testid="card-agent-replacement">
      <CardHeader>
        <CardTitle>Agent Replacement Tool</CardTitle>
        <CardDescription>
          Replace your current agent with a new one using the Master LLM.
          Your phone number will be preserved.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {currentAgentId && (
          <div className="text-sm">
            <strong>Current Agent ID:</strong> {currentAgentId}
          </div>
        )}
        
        {phoneNumber && (
          <div className="text-sm">
            <strong>Phone Number:</strong> {phoneNumber}
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            What happens during replacement:
          </p>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
            <li>New agent created with Master LLM (Gemini 2.5 Flash)</li>
            <li>Phone number {phoneNumber || 'reassigned'} to new agent</li>
            <li>Old agent deleted</li>
            <li>Database updated with new agent ID</li>
            <li>Process takes ~5-10 seconds</li>
          </ul>
        </div>
        
        {replacementResult && (
          <div className="p-4 rounded-md flex items-start gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-green-900 dark:text-green-100">
                {replacementResult.message}
              </p>
              <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <p><strong>Old Agent:</strong> {replacementResult.oldAgentId}</p>
                <p><strong>New Agent:</strong> {replacementResult.newAgentId}</p>
                <p><strong>Agent Type:</strong> {replacementResult.agentType}</p>
                <p><strong>Master LLM:</strong> {replacementResult.masterLlmId}</p>
                <p><strong>Phone:</strong> {replacementResult.formattedPhoneNumber}</p>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => replaceMutation.mutate()}
          disabled={replaceMutation.isPending || !!replacementResult}
          className="w-full"
          data-testid="button-replace-agent"
        >
          {replaceMutation.isPending ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Replacing Agent...
            </>
          ) : replacementResult ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Replacement Complete
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Replace Agent (Keep Phone Number)
            </>
          )}
        </Button>
        
        {replacementResult && (
          <p className="text-xs text-muted-foreground text-center">
            Refresh the page to see updated agent information
          </p>
        )}
      </CardContent>
    </Card>
  );
}
