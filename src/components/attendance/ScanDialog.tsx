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
  const [activeScanners] = useState(new Set<string>());
  const [scanType, setScanType] = useState<ScanType>("QR");

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

  const handleSuccessfulScan = async (code: string, scannerId: string, type: ScanType) => {
    if (activeScanners.has(scannerId)) {
      return;
    }

    const newScan: Omit<ScanRecord, "id"> = {
      userId: code,
      attendanceId: attendance.id,
      scanType: type,
      direction,
      timestamp: new Date()
    };

    const validation = validateScan(newScan, existingScans);

    if (validation.isValid) {
      playSuccess();
      onScanSuccess(newScan);
      toast.success(validation.message, {
        description: `Scan ${type} enregistré à ${new Date().toLocaleTimeString()} (Scanner ${scannerId})`
      });
    } else {
      playError();
      toast.error(validation.message);
    }

    activeScanners.add(scannerId);
    setTimeout(() => {
      activeScanners.delete(scannerId);
    }, 1000);
  };

  // Gérer les scanners physiques
  useEffect(() => {
    const scanners: { [key: string]: { code: string; timeout: NodeJS.Timeout | null } } = {
      scanner1: { code: "", timeout: null },
      scanner2: { code: "", timeout: null },
      scanner3: { code: "", timeout: null },
      scanner4: { code: "", timeout: null }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      let activeScanner = "scanner1";
      for (const [scannerId, scanner] of Object.entries(scanners)) {
        if (!scanner.timeout) {
          activeScanner = scannerId;
          break;
        }
      }

      if (event.key === "Enter" && scanners[activeScanner].code) {
        // Détecter si c'est un QR code ou un code-barres basé sur le format
        const scanType: ScanType = scanners[activeScanner].code.startsWith("FIF") ? "BARCODE" : "QR";
        handleSuccessfulScan(scanners[activeScanner].code, activeScanner, scanType);
        scanners[activeScanner].code = "";
        return;
      }

      scanners[activeScanner].code += event.key;

      if (scanners[activeScanner].timeout) {
        clearTimeout(scanners[activeScanner].timeout);
      }

      scanners[activeScanner].timeout = setTimeout(() => {
        scanners[activeScanner].code = "";
        scanners[activeScanner].timeout = null;
      }, 100);
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      Object.values(scanners).forEach(scanner => {
        if (scanner.timeout) {
          clearTimeout(scanner.timeout);
        }
      });
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
                      handleSuccessfulScan(decodedText, 'camera', "QR");
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
              ? "Utilisez jusqu'à 4 scanners QR simultanément ou placez un QR code devant la caméra"
              : "Utilisez jusqu'à 4 scanners de codes-barres simultanément"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
