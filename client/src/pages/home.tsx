import { ChatInterface } from "@/components/chat-interface";
import { Card } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <BrandLogo />
          <ThemeToggle />
        </header>
        <Card className="p-4">
          <ChatInterface />
        </Card>
      </div>
    </div>
  );
}