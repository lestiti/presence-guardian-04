import { useState } from "react";
import { toast } from "sonner";
import useSound from "use-sound";
import { validateScan } from "@/utils/scanValidation";
import { ScanType, ScanRecord } from "@/types/attendance";
import { supabase } from "@/integrations/supabase/client";

interface UseScanHandlerProps {
  onScanSuccess: (scanRecord: Omit<ScanRecord, "id">) => void;
  attendance: any;
  direction: "IN" | "OUT";
  existingScans: ScanRecord[];
}

export const useScanHandler = ({ onScanSuccess, attendance, direction, existingScans }: UseScanHandlerProps) => {
  const [processingCode, setProcessingCode] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [playSuccess] = useSound("/sounds/success.mp3", { volume: 0.25 });
  const [playError] = useSound("/sounds/error.mp3", { volume: 0.25 });

  const handleSuccessfulScan = async (code: string, type: ScanType) => {
    if (processingCode) return;
    
    setProcessingCode(true);
    console.log("Code scanné:", code, "Type:", type);
    
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
        // Enregistrer le scan dans Supabase
        const { data, error } = await supabase
          .from('scans')
          .insert([newScan])
          .select()
          .single();

        if (error) {
          console.error("Erreur lors de l'enregistrement du scan:", error);
          playError();
          toast.error("Erreur lors de l'enregistrement du scan");
          return;
        }

        console.log("Scan enregistré avec succès:", data);
        playSuccess();
        await onScanSuccess(newScan);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);

        const actionMessage = direction === "IN" ? "Entrée" : "Sortie";
        toast.success(`${actionMessage} enregistrée avec succès`, {
          description: `Scan ${type} enregistré à ${new Date().toLocaleTimeString()}`
        });
      } else {
        playError();
        toast.error(validation.message);
      }
    } catch (error) {
      console.error("Erreur lors du scan:", error);
      toast.error("Erreur lors du scan");
      playError();
    } finally {
      setTimeout(() => {
        setProcessingCode(false);
      }, 1000);
    }
  };

  return {
    handleSuccessfulScan,
    showSuccess,
    processingCode
  };
};