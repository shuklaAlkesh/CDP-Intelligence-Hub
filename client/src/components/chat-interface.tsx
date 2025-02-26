import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MessageList } from "./message-list";
import { QuestionInput } from "./question-input";
import { CdpSelector } from "./cdp-selector";
import { type CDP } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { sendMessage } from "@/lib/chat";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatInterface() {
  const [selectedCdp, setSelectedCdp] = useState<CDP>("segment");
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages"],
  });

  const mutation = useMutation({
    mutationFn: ({ question }: { question: string }) =>
      sendMessage(question, selectedCdp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
        <CdpSelector value={selectedCdp} onChange={setSelectedCdp} />
        <Card className="p-4 flex-1 text-sm text-muted-foreground border-2 border-primary/10 dark:border-primary/20">
          <p>Ask me anything about {selectedCdp}! For example:</p>
          <ul className="list-disc ml-4 mt-2">
            <li>How do I set up {selectedCdp}?</li>
            <li>How does {selectedCdp} handle user profiles?</li>
            <li>Compare {selectedCdp} with other CDPs</li>
          </ul>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <MessageList messages={messages} isLoading={mutation.isPending} />
      )}

      <QuestionInput
        onSubmit={(question) => mutation.mutate({ question })}
        disabled={mutation.isPending}
        placeholder={`Ask a question about ${selectedCdp}...`}
      />
    </div>
  );
}