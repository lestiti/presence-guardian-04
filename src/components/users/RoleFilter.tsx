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
    <Select value={value || "all"} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-white/80 backdrop-blur-sm border-white/20">
        <SelectValue placeholder="Filtrer par rôle" />
      </SelectTrigger>
      <SelectContent className="bg-white/90 backdrop-blur-sm border-white/20">
        <SelectItem value="all" className="hover:bg-primary/10">Tous les rôles</SelectItem>
        <SelectItem value="MPIOMANA" className="hover:bg-primary/10">MPIOMANA</SelectItem>
        <SelectItem value="MPIANDRY" className="hover:bg-primary/10">MPIANDRY</SelectItem>
        <SelectItem value="MPAMPIANATRA" className="hover:bg-primary/10">MPAMPIANATRA</SelectItem>
        <SelectItem value="IRAKA" className="hover:bg-primary/10">IRAKA</SelectItem>
      </SelectContent>
    </Select>
  );
};