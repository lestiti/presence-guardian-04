import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "sonner";
import useSound from "use-sound";
import { Camera, QrCode, Barcode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateScan } from "@/utils/scanValidation";
import { ScanType, ScanRecord } from "@/types/attendance";

interface ScanDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (scanRecord: Omit<ScanRecord, "id">) => void;
  attendance: any;
  direction: "IN" | "OUT";
  existingScans: ScanRecord[];
}

export const ScanDialog = ({ 
  open, 
  onClose, 
  onScanSuccess, 
  attendance,
  direction,
  existingScans 
}: ScanDialogProps) => {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [playSuccess] = useSound("/sounds/success.mp3");
  const [playError] = useSound("/sounds/error.mp3");
  const [scanType, setScanType] = useState<ScanType>("QR");
  const [lastProcessedCodes] = useState<Set<string>>(new Set());
  const [processingCode, setProcessingCode] = useState<boolean>(false);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        const rearCamera = videoDevices.find(device => 
          device.label.toLowerCase().includes("back") || 
          device.label.toLowerCase().includes("arrière")
        );
        setSelectedDevice(rearCamera || videoDevices[0]);
      } catch (error) {
        console.error("Error getting devices:", error);
        toast.error("Erreur lors de l'accès aux périphériques");
      }
    };

    if (open) {
      getDevices();
    }
  }, [open]);

  const handleSuccessfulScan = async (code: string, type: ScanType) => {
    if (processingCode) return;

    setProcessingCode(true);
    
    try {
      const newScan: Omit<ScanRecord, "id"> = {
        userId: code,
        attendanceId: attendance?.id || "default",
        scanType: type,
        direction,
        timestamp: new Date()
      };

      const validation = validateScan(newScan, existingScans);

      if (validation.isValid) {
        playSuccess();
        await onScanSuccess(newScan);
        toast.success(validation.message, {
          description: `Scan ${type} enregistré à ${new Date().toLocaleTimeString()}`
        });
      } else {
        playError();
        toast.error(validation.message);
      }
    } finally {
      // Réinitialiser l'état de traitement après un court délai
      setTimeout(() => {
        setProcessingCode(false);
      }, 500); // Délai de 500ms entre les scans
    }
  };

  // Gérer les scanners physiques
  useEffect(() => {
    let currentCode = "";
    let lastKeyTime = Date.now();
    const SCANNER_TIMEOUT = 50; // 50ms entre les caractères

    const handleKeyPress = (event: KeyboardEvent) => {
      const currentTime = Date.now();

      // Si le délai entre les touches est trop long, on considère que c'est un nouveau code
      if (currentTime - lastKeyTime > SCANNER_TIMEOUT) {
        currentCode = "";
      }
      lastKeyTime = currentTime;

      if (event.key === "Enter" && currentCode) {
        // Détecter si c'est un QR code ou un code-barres basé sur le format
        const scanType: ScanType = currentCode.startsWith("FIF") ? "BARCODE" : "QR";
        handleSuccessfulScan(currentCode, scanType);
        currentCode = "";
        return;
      }

      currentCode += event.key;
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>
          {direction === "IN" ? "Check-in" : "Check-out"} - {scanType === "QR" ? "QR Code" : "Code-barres"}
        </DialogTitle>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant={scanType === "QR" ? "default" : "outline"}
              onClick={() => setScanType("QR")}
              className="flex items-center space-x-2"
            >
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </Button>
            <Button
              variant={scanType === "BARCODE" ? "default" : "outline"}
              onClick={() => setScanType("BARCODE")}
              className="flex items-center space-x-2"
            >
              <Barcode className="w-4 h-4" />
              <span>Code-barres</span>
            </Button>
          </div>

          {scanType === "QR" && selectedDevice && (
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <QrReader
                constraints={{
                  deviceId: selectedDevice.deviceId,
                  facingMode: "environment"
                }}
                onResult={(result) => {
                  if (result) {
                    const decodedText = result.getText();
                    if (decodedText) {
                      handleSuccessfulScan(decodedText, "QR");
                    }
                  }
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 pointer-events-none border-4 border-primary/50 animate-pulse rounded-lg" />
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {scanType === "QR" 
              ? "Scannez autant de QR codes que nécessaire"
              : "Scannez autant de codes-barres que nécessaire"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};