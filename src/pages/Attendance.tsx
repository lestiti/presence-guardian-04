import { useState } from "react";
import { toast } from "sonner";
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { ScanDialog } from "@/components/attendance/ScanDialog";
import { ScanRecord } from "@/types/attendance";

const Attendance = () => {
  const [showScanDialog, setShowScanDialog] = useState(false);
  const [scans, setScans] = useState<ScanRecord[]>([]);

  const handleStartScan = () => {
    setShowScanDialog(true);
  };

  const handleScanSuccess = async (scanRecord: Omit<ScanRecord, "id">) => {
    try {
      // Créer un nouvel enregistrement avec un ID unique
      const newScan: ScanRecord = {
        ...scanRecord,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Ajouter le nouveau scan à la liste
      setScans(prevScans => [...prevScans, newScan]);
      
      // Ne pas fermer la fenêtre pour permettre des scans successifs
      toast.success("Scan enregistré avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du scan:", error);
      toast.error("Erreur lors de l'enregistrement du scan");
    }
  };

  return (
    <div className="space-y-6">
      <AttendanceHeader onStartScan={handleStartScan} />

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

export default Attendance;