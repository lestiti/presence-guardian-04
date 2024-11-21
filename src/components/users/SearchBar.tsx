import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Rechercher..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 max-w-sm"
      />
    </div>
  );
};