import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizontal } from "lucide-react";

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function QuestionInput({ onSubmit, disabled, placeholder }: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      onSubmit(question.trim());
      setQuestion("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={placeholder || "Ask a question..."}
        className="min-h-[80px]"
        disabled={disabled}
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={disabled || !question.trim()}
        className="self-end"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}