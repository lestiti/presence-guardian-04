import { useState } from "react";
import { Grid, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Synod {
  id: string;
  name: string;
  color: string;
  memberCount: number;
}

const Synods = () => {
  const { toast } = useToast();
  const [synods] = useState<Synod[]>([
    { id: "1", name: "Synod A", color: "#10B981", memberCount: 25 },
    { id: "2", name: "Synod B", color: "#6366F1", memberCount: 30 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-secondary">Gestion des Synodes</h1>
        <Button className="bg-primary hover:bg-primary/90 transition-colors">
          <Grid className="w-4 h-4 mr-2" />
          Nouveau Synode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {synods.map((synod) => (
          <div
            key={synod.id}
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
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="hover:bg-destructive/10 transition-colors duration-200"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-lg text-secondary/80 font-medium">
              {synod.memberCount} membres
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Synods;