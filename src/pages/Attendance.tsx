import { useState } from "react";
import { toast } from "sonner";
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { ScanDialog } from "@/components/attendance/ScanDialog";
import { ScanRecord } from "@/types/attendance";

const Attendance = () => {
  const [showScanDialog, setShowScanDialog] = useState(false);

  const handleStartScan = () => {
    setShowScanDialog(true);
  };

  const handleScanSuccess = async (scanRecord: Omit<ScanRecord, "id">) => {
    try {
      // Ici, vous pouvez implémenter la logique pour enregistrer le scan
      console.log("Scan enregistré:", scanRecord);
      setShowScanDialog(false);
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
        existingScans={[]}
      />
    </div>
  );
};

export default Attendance;