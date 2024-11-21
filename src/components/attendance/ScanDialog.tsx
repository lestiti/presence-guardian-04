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
  const [playSuccess] = useSound("/sounds/success.mp3");
  const [playError] = useSound("/sounds/error.mp3");

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

  const handleSuccessfulScan = (code: string) => {
    playSuccess();
    onScanSuccess(code);
    toast.success("Code scanné avec succès", {
      description: `Scan enregistré à ${new Date().toLocaleTimeString()}`
    });
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

    // Activer la détection du scanner physique même si la boîte de dialogue n'est pas ouverte
    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(timeoutId);
    };
  }, []);

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
                onResult={(result) => {
                  if (result?.text) {
                    handleSuccessfulScan(result.text);
                  }
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 pointer-events-none border-4 border-primary/50 animate-pulse rounded-lg" />
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Utilisez directement votre scanner physique ou placez un code QR devant la caméra
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};