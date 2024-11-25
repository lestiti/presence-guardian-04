import { Synod } from "@/types/synod";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface SynodCardProps {
  synod: Synod;
  onEdit: (synod: Synod) => void;
  onDelete: (synod: Synod) => void;
}

export const SynodCard = ({ synod, onEdit, onDelete }: SynodCardProps) => {
  return (
    <div
      className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-white/20 hover:shadow-lg transition-all duration-200 animate-fade-in"
      style={{ borderTop: `4px solid ${synod.color}` }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-semibold tracking-tight text-secondary">
          {synod.name}
        </h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            className="hover:bg-primary/10 transition-colors duration-200"
            onClick={() => onEdit(synod)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="hover:bg-destructive/10 transition-colors duration-200"
            onClick={() => onDelete(synod)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {synod.description && (
        <p className="text-secondary/60 mb-2">{synod.description}</p>
      )}
      <p className="text-lg text-secondary/80 font-medium">
        {synod.member_count} membres
      </p>
    </div>
  );
};