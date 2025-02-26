import { type CDP } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CdpSelectorProps {
  value: CDP;
  onChange: (value: CDP) => void;
}

export function CdpSelector({ value, onChange }: CdpSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange as (value: string) => void}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select CDP" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="segment">Segment</SelectItem>
        <SelectItem value="mparticle">mParticle</SelectItem>
        <SelectItem value="lytics">Lytics</SelectItem>
        <SelectItem value="zeotap">Zeotap</SelectItem>
      </SelectContent>
    </Select>
  );
}
