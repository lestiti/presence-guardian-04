import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoleFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const RoleFilter = ({ value, onChange }: RoleFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filtrer par rôle" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tous les rôles</SelectItem>
        <SelectItem value="MPIOMANA">MPIOMANA</SelectItem>
        <SelectItem value="MPIANDRY">MPIANDRY</SelectItem>
        <SelectItem value="MPAMPIANATRA">MPAMPIANATRA</SelectItem>
        <SelectItem value="IRAKA">IRAKA</SelectItem>
      </SelectContent>
    </Select>
  );
};