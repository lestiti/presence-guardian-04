import { Card } from "@/components/ui/card";
import { Synod } from "@/types/synod";

interface SynodActivityProps {
  synods: Synod[];
}

export const SynodActivity = ({ synods }: SynodActivityProps) => (
  <Card className="bg-white/10 backdrop-blur-glass border border-white/20 p-6">
    <h2 className="text-xl font-semibold text-white mb-4">Activité récente</h2>
    <div className="space-y-4">
      {synods.slice(0, 3).map((synod) => (
        <div key={synod.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: synod.color }}
          >
            <span className="text-white font-medium">
              {synod.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{synod.name}</p>
            <p className="text-sm text-white/60">{synod.member_count || 0} membres</p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);