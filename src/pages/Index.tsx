import { Users, QrCode, BarChart2 } from "lucide-react";
import { useState } from "react";
import { ScanDialog } from "@/components/attendance/ScanDialog";
import { ScanRecord } from "@/types/attendance";
import { toast } from "sonner";
import { useSynodStore } from "@/stores/synodStore";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatCard = ({ icon: Icon, title, value, trend }: { icon: any; title: string; value: string; trend: string }) => (
  <div className="bg-white/10 backdrop-blur-glass border border-white/20 rounded-lg p-6 shadow-glass animate-fade-in transition-all duration-300 hover:animate-zoom-hover">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <h3 className="text-white/80 font-medium">{title}</h3>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
      <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="mt-4 text-sm text-white/60">{trend}</p>
  </div>
);

const Index = () => {
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const { synods } = useSynodStore();

  const handleScanSuccess = async (scanRecord: Omit<ScanRecord, "id">) => {
    try {
      const newScan: ScanRecord = {
        ...scanRecord,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };
      setScans((prevScans) => [...prevScans, newScan]);
      toast.success("Scan enregistré avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du scan:", error);
      toast.error("Erreur lors de l'enregistrement du scan");
    }
  };

  // Données de présence simulées pour le graphique
  const attendanceData = [
    { date: "Lun", présents: 65, absents: 35 },
    { date: "Mar", présents: 75, absents: 25 },
    { date: "Mer", présents: 80, absents: 20 },
    { date: "Jeu", présents: 70, absents: 30 },
    { date: "Ven", présents: 85, absents: 15 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
          <p className="mt-2 text-white/60">Bienvenue sur FPVM Checking System</p>
        </div>
        <button
          onClick={() => setShowScanDialog(true)}
          className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-300 border border-white/20"
        >
          <QrCode className="w-5 h-5" />
          <span>Scanner maintenant</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Utilisateurs"
          value={`${synods.reduce((acc, synod) => acc + (synod.memberCount || 0), 0)}`}
          trend={`${synods.length} synodes actifs`}
        />
        <StatCard
          icon={QrCode}
          title="Présences aujourd'hui"
          value={`${scans.length}`}
          trend="Dernière mise à jour il y a quelques minutes"
        />
        <StatCard
          icon={BarChart2}
          title="Taux de présence"
          value="78%"
          trend="+5% par rapport à la semaine dernière"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/10 backdrop-blur-glass border border-white/20 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Présences de la semaine</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Legend />
                <Bar dataKey="présents" fill="#4ade80" />
                <Bar dataKey="absents" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

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
                  <p className="text-sm text-white/60">{synod.memberCount || 0} membres</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <ScanDialog
        open={showScanDialog}
        onClose={() => setShowScanDialog(false)}
        onScanSuccess={handleScanSuccess}
        attendance={null}
        direction="IN"
        existingScans={scans}
      />
    </div>
  );
};

export default Index;