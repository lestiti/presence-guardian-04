import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Synod } from "@/types/synod";

interface SynodSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  synods: Synod[];
}

export const SynodSelect = ({ value, onValueChange, synods }: SynodSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Sélectionner un synode" />
      </SelectTrigger>
      <SelectContent>
        {synods.map((synod) => (
          <SelectItem key={synod.id} value={synod.id}>
            {synod.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};