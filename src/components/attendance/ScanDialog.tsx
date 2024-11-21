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
  const [activeScanners] = useState(new Set<string>());

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

  const handleSuccessfulScan = (code: string, scannerId: string) => {
    // Vérifier si ce scanner est déjà actif
    if (activeScanners.has(scannerId)) {
      return;
    }

    playSuccess();
    onScanSuccess(code);
    toast.success("Code scanné avec succès", {
      description: `Scan enregistré à ${new Date().toLocaleTimeString()} (Scanner ${scannerId})`
    });

    // Ajouter le scanner à la liste des scanners actifs
    activeScanners.add(scannerId);

    // Réinitialiser le scanner après un délai
    setTimeout(() => {
      activeScanners.delete(scannerId);
    }, 1000); // Délai de 1 seconde avant de pouvoir réutiliser le même scanner
  };

  // Gérer automatiquement les entrées des scanners physiques
  useEffect(() => {
    const scanners: { [key: string]: { code: string; timeout: NodeJS.Timeout | null } } = {
      scanner1: { code: "", timeout: null },
      scanner2: { code: "", timeout: null },
      scanner3: { code: "", timeout: null },
      scanner4: { code: "", timeout: null }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      // Identifier le scanner en fonction du timing des entrées
      const currentTime = Date.now();
      let activeScanner = "scanner1";

      // Trouver le premier scanner disponible
      for (const [scannerId, scanner] of Object.entries(scanners)) {
        if (!scanner.timeout) {
          activeScanner = scannerId;
          break;
        }
      }

      // Si c'est la touche Entrée et qu'on a un code
      if (event.key === "Enter" && scanners[activeScanner].code) {
        handleSuccessfulScan(scanners[activeScanner].code, activeScanner);
        scanners[activeScanner].code = ""; // Réinitialiser pour le prochain scan
        return;
      }

      // Ajouter le caractère au code
      scanners[activeScanner].code += event.key;

      // Réinitialiser le timeout
      if (scanners[activeScanner].timeout) {
        clearTimeout(scanners[activeScanner].timeout);
      }

      scanners[activeScanner].timeout = setTimeout(() => {
        scanners[activeScanner].code = "";
        scanners[activeScanner].timeout = null;
      }, 100); // Réinitialiser après 100ms sans nouvelle entrée
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      // Nettoyer tous les timeouts
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
                  if (result) {
                    const decodedText = result.getText();
                    if (decodedText) {
                      handleSuccessfulScan(decodedText, 'camera');
                    }
                  }
                }}
                className="w-full h-full"
              />
              <div className="absolute inset-0 pointer-events-none border-4 border-primary/50 animate-pulse rounded-lg" />
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Utilisez jusqu'à 4 scanners physiques simultanément ou placez un code QR devant la caméra
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};