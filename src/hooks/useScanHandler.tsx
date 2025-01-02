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
    if (processingCode) {
      console.log("Scan ignored - already processing a code");
      return;
    }
    
    setProcessingCode(true);
    console.log("Processing scan:", { code, type, direction });
    
    try {
      // Vérifier si le code est valide
      if (!code || code.trim() === "") {
        throw new Error("Code QR invalide");
      }

      const newScan: Omit<ScanRecord, "id"> = {
        user_id: code,
        attendance_id: attendance?.id || "default",
        scan_type: type,
        direction,
        timestamp: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      console.log("Validating scan...");
      const validation = validateScan(newScan, existingScans);

      if (validation.isValid) {
        console.log("Scan validation successful, saving to database...");
        
        const { data, error } = await supabase
          .from('scans')
          .insert([newScan])
          .select()
          .single();

        if (error) {
          console.error("Database error:", error);
          throw new Error("Erreur lors de l'enregistrement du scan");
        }

        console.log("Scan saved successfully:", data);
        playSuccess();
        await onScanSuccess(newScan);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);

        const actionMessage = direction === "IN" ? "Entrée" : "Sortie";
        toast.success(`${actionMessage} enregistrée avec succès`, {
          description: `Scan ${type} enregistré à ${new Date().toLocaleTimeString()}`
        });
      } else {
        throw new Error(validation.message);
      }
    } catch (error) {
      console.error("Error processing scan:", error);
      playError();
      toast.error(error instanceof Error ? error.message : "Erreur lors du scan");
    } finally {
      setTimeout(() => {
        setProcessingCode(false);
        console.log("Scan processing completed");
      }, 1000);
    }
  };

  return {
    handleSuccessfulScan,
    showSuccess,
    processingCode
  };
};