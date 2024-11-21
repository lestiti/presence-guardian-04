import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "sonner";
import useSound from "use-sound";
import { Camera } from "lucide-react";

interface ScanDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  attendance: any;
}

export const ScanDialog = ({ open, onClose, onScanSuccess }: ScanDialogProps) => {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [playSuccess] = useSound("/sounds/success.mp3");
  const [playError] = useSound("/sounds/error.mp3");

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);
        
        // Sélectionner automatiquement la caméra arrière si disponible
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

  const handleScan = (result: any) => {
    if (result) {
      const scannedData = result?.text;
      if (scannedData) {
        handleSuccessfulScan(scannedData);
      }
    }
  };

  const handleSuccessfulScan = (code: string) => {
    playSuccess();
    onScanSuccess(code);
    toast.success("Code scanné avec succès", {
      description: `Scan enregistré à ${new Date().toLocaleTimeString()}`
    });
  };

  const handleError = (error: any) => {
    console.error(error);
    playError();
    toast.error("Erreur lors du scan");
  };

  // Gérer automatiquement les entrées du scanner physique
  useEffect(() => {
    let scannedCode = "";
    let timeoutId: NodeJS.Timeout;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Si c'est la touche Entrée et qu'on a un code
      if (event.key === "Enter" && scannedCode) {
        handleSuccessfulScan(scannedCode);
        scannedCode = ""; // Réinitialiser pour le prochain scan
        return;
      }

      // Ajouter le caractère au code
      scannedCode += event.key;

      // Réinitialiser le timeout
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        scannedCode = "";
      }, 100); // Réinitialiser après 100ms sans nouvelle entrée
    };

    if (open) {
      window.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <div className="flex items-center justify-center p-2">
            <Camera className="w-8 h-8 text-primary animate-pulse" />
          </div>

          {selectedDevice && (
            <div className="relative aspect-square overflow-hidden rounded-lg">
              <QrReader
                constraints={{
                  deviceId: selectedDevice.deviceId,
                  facingMode: "environment"
                }}
                onResult={handleScan}
                className="w-full h-full"
              />
              <div className="absolute inset-0 pointer-events-none border-4 border-primary/50 animate-pulse rounded-lg" />
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Placez votre code QR ou code-barres devant la caméra, ou utilisez un scanner physique
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};