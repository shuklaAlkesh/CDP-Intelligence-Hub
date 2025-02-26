import { type Message } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className="bg-muted p-4 rounded-lg border border-border/50">
              <p className="font-medium">Question:</p>
              <p>{message.question}</p>
            </div>
            <div className={cn(
              "p-4 rounded-lg border",
              message.question.toLowerCase().includes("compare")
                ? "bg-blue-500/5 dark:bg-blue-500/10 border-blue-200/20 dark:border-blue-500/20"
                : "bg-primary/5 dark:bg-primary/10 border-primary/20"
            )}>
              <p className="font-medium">Answer:</p>
              <p className="whitespace-pre-wrap">{message.answer}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  <p className="font-medium">Sources:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {message.sources.map((source, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center gap-1"
                        >
                          {source.title}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}