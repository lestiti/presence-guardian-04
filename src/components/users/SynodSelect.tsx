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
      <SelectTrigger className={cn(className)}>
        <SelectValue placeholder="Sélectionner un synode" />
      </SelectTrigger>
      <SelectContent>
        {synods.map((synod) => (
          <SelectItem 
            key={synod.id} 
            value={synod.id}
            className="flex items-center gap-2"
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