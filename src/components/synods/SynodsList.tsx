import { Synod } from "@/types/synod";
import { SynodCard } from "./SynodCard";

interface SynodsListProps {
  synods: Synod[];
  onEdit: (synod: Synod) => void;
  onDelete: (synod: Synod) => void;
}

export const SynodsList = ({ synods, onEdit, onDelete }: SynodsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {synods.map((synod) => (
        <SynodCard
          key={synod.id}
          synod={synod}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};