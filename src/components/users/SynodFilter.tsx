import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SynodFilterProps {
  value: string;
  synods: string[];
  onChange: (value: string) => void;
}

export const SynodFilter = ({ value, synods, onChange }: SynodFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrer par synode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les synodes</SelectItem>
        {synods.map((synod) => (
          <SelectItem key={synod} value={synod}>
            {synod}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};