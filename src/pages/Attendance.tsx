import { useState } from "react";
import { toast } from "sonner";
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { ScanDialog } from "@/components/attendance/ScanDialog";

const Attendance = () => {
  const [showScanDialog, setShowScanDialog] = useState(false);

  const handleStartScan = () => {
    setShowScanDialog(true);
  };

  const handleScanSuccess = async (code: string) => {
    try {
      // Ici, vous pouvez implémenter la logique pour enregistrer le scan
      console.log("Code scanné:", code);
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
      />
    </div>
  );
};

export default Attendance;