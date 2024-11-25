import { useState, useEffect } from "react";
import { toast } from "sonner";
import useSound from "use-sound";
import { validateScan } from "@/utils/scanValidation";
import { ScanType, ScanRecord } from "@/types/attendance";

interface UseScanHandlerProps {
  onScanSuccess: (scanRecord: Omit<ScanRecord, "id">) => void;
  attendance: any;
  direction: "IN" | "OUT";
  existingScans: ScanRecord[];
}

export const useScanHandler = ({ onScanSuccess, attendance, direction, existingScans }: UseScanHandlerProps) => {
  const [processingCode, setProcessingCode] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [playSuccess] = useSound("/sounds/success.mp3");
  const [playError] = useSound("/sounds/error.mp3");

  const handleSuccessfulScan = async (code: string, type: ScanType) => {
    if (processingCode) return;

    setProcessingCode(true);
    
    try {
      const newScan: Omit<ScanRecord, "id"> = {
        user_id: code,
        attendance_id: attendance?.id || "default",
        scan_type: type,
        direction,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const validation = validateScan(newScan, existingScans);

      if (validation.isValid) {
        playSuccess();
        await onScanSuccess(newScan);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
        toast.success(validation.message, {
          description: `Scan ${type} enregistré à ${new Date().toLocaleTimeString()}`
        });
      } else {
        playError();
        toast.error(validation.message);
      }
    } finally {
      setTimeout(() => {
        setProcessingCode(false);
      }, 500);
    }
  };

  return {
    handleSuccessfulScan,
    showSuccess,
    processingCode
  };
};