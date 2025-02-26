import { Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <Database className="h-8 w-8 text-primary" />
        <div className="absolute -inset-1 bg-primary/20 rounded-full blur-lg animate-pulse dark:bg-primary/40" />
      </div>
      <div className="font-bold text-2xl text-gray-900 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent dark:from-primary dark:via-primary dark:to-primary/80">
        CDP Intelligence Hub
      </div>
    </div>
  );
}