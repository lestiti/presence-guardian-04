import { SearchBar } from "./SearchBar";
import { RoleFilter } from "./RoleFilter";
import { SynodFilter } from "./SynodFilter";

interface UsersFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  synodFilter: string;
  onSynodFilterChange: (value: string) => void;
  synods: string[];
}

export const UsersFilters = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  synodFilter,
  onSynodFilterChange,
  synods,
}: UsersFiltersProps) => {
  return (
    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-white/20 animate-fade-in">
      <div className="flex flex-wrap gap-4">
        <SearchBar value={searchTerm} onChange={onSearchChange} />
        <RoleFilter value={roleFilter} onChange={onRoleFilterChange} />
        <SynodFilter value={synodFilter} synods={synods} onChange={onSynodFilterChange} />
      </div>
    </div>
  );
};