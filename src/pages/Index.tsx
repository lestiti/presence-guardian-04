import { Users, QrCode, BarChart2 } from "lucide-react";
import { useState } from "react";
import { ScanDialog } from "@/components/attendance/ScanDialog";
import { ScanRecord } from "@/types/attendance";
import { toast } from "sonner";
import { useSynodStore } from "@/stores/synodStore";
import { StatCard } from "@/components/dashboard/StatCard";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { SynodActivity } from "@/components/dashboard/SynodActivity";

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
          value={`${synods.reduce((acc, synod) => acc + (synod.member_count || 0), 0)}`}
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
        <AttendanceChart data={attendanceData} />
        <SynodActivity synods={synods} />
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