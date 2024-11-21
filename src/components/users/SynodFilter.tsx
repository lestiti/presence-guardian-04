import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSynodStore } from "@/stores/synodStore";

interface SynodFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const SynodFilter = ({ value, onChange }: SynodFilterProps) => {
  const { synods } = useSynodStore();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrer par synode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les synodes</SelectItem>
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