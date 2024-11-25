import { Synod } from "@/types/synod";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface SynodCardProps {
  synod: Synod;
  onEdit: (synod: Synod) => void;
  onDelete: (synod: Synod) => void;
}

export const SynodCard = ({ synod, onEdit, onDelete }: SynodCardProps) => {
  return (
    <Card className="bg-white/50 backdrop-blur-sm rounded-lg shadow-soft border border-white/20 hover:shadow-lg transition-all duration-200 animate-fade-in overflow-hidden">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: synod.color }}
      />
      <CardHeader className="flex justify-between items-start">
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
            <span className="sr-only">Modifier {synod.name}</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="hover:bg-destructive/10 transition-colors duration-200"
            onClick={() => onDelete(synod)}
          >
            <Trash className="w-4 h-4" />
            <span className="sr-only">Supprimer {synod.name}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {synod.description && (
          <p className="text-secondary/60 mb-4">{synod.description}</p>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-lg text-secondary/80 font-medium">
          {synod.member_count || 0} membres
        </p>
      </CardFooter>
    </Card>
  );
};