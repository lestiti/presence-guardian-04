import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "sonner";
import useSound from "use-sound";
import { Check, X, Camera, Barcode, QrCode } from "lucide-react";

interface ScanDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  attendance: any;
}

export const ScanDialog = ({ open, onClose, onScanSuccess }: ScanDialogProps) => {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [scanType, setScanType] = useState<"qr" | "barcode">("qr");
  const [playSuccess] = useSound("/sounds/success.mp3");
  const [playError] = useSound("/sounds/error.mp3");

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[0]);
        }
      } catch (error) {
        console.error("Error getting devices:", error);
        toast.error("Erreur lors de l'accès aux périphériques");
      }
    };

    if (open) {
      getDevices();
      setScanning(true);
      setManualCode("");
    } else {
      setScanning(false);
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

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      handleSuccessfulScan(manualCode.trim());
    }
  };

  const handleSuccessfulScan = (code: string) => {
    const timestamp = new Date().toISOString();
    playSuccess();
    onScanSuccess(code);
    setScanning(false);
    toast.success(`Code ${scanType === "qr" ? "QR" : "barre"} scanné avec succès`, {
      icon: <Check className="w-4 h-4 text-green-500" />,
      description: `Scan enregistré à ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleError = (error: any) => {
    console.error(error);
    playError();
    toast.error("Erreur lors du scan", {
      icon: <X className="w-4 h-4 text-red-500" />,
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {
      setScanning(false);
      onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Scanner un code</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Caméra
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <Barcode className="w-4 h-4" />
              Scanner/Manuel
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de scan</label>
              <div className="flex space-x-2">
                <Button
                  variant={scanType === "qr" ? "default" : "outline"}
                  onClick={() => setScanType("qr")}
                  className="flex-1"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
                <Button
                  variant={scanType === "barcode" ? "default" : "outline"}
                  onClick={() => setScanType("barcode")}
                  className="flex-1"
                >
                  <Barcode className="w-4 h-4 mr-2" />
                  Code-barres
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sélectionner la caméra</label>
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const device = devices.find(d => d.deviceId === e.target.value);
                  setSelectedDevice(device || null);
                }}
                value={selectedDevice?.deviceId}
              >
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Caméra ${device.deviceId}`}
                  </option>
                ))}
              </select>
            </div>

            {scanning && selectedDevice && (
              <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-dashed border-gray-200">
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
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Entrer le code manuellement ou utiliser un scanner physique
                </label>
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Scanner ou entrer le code"
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit">Valider</Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};