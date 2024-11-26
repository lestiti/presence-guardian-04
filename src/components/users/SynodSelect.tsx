import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSynodStore } from "@/stores/synodStore";
import { cn } from "@/lib/utils";

interface SynodSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const SynodSelect = ({ value, onValueChange, className }: SynodSelectProps) => {
  const { synods } = useSynodStore();

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn("bg-white/80 backdrop-blur-sm border-white/20", className)}>
        <SelectValue placeholder="Sélectionner un synode" />
      </SelectTrigger>
      <SelectContent className="bg-white/90 backdrop-blur-sm border-white/20">
        {synods.map((synod) => (
          <SelectItem 
            key={synod.id} 
            value={synod.id}
            className="flex items-center gap-2 hover:bg-primary/10"
          >
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: synod.color }} 
            />
            {synod.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};