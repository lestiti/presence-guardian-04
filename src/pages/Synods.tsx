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
        <Button className="bg-primary hover:bg-primary-dark">
          <Grid className="w-4 h-4 mr-2" />
          Nouveau Synode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {synods.map((synod) => (
          <div
            key={synod.id}
            className="card hover:shadow-lg transition-shadow duration-200"
            style={{ borderTop: `4px solid ${synod.color}` }}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-secondary">{synod.name}</h3>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-secondary-light">
              {synod.memberCount} membres
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Synods;