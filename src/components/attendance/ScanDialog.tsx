import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { toast } from "sonner";
import useSound from "use-sound";
import { Check, X } from "lucide-react";

interface ScanDialogProps {
  open: boolean;
  onClose: () => void;
  onScanSuccess: (code: string) => void;
  attendance: {
    id: string;
    date: string;
    synod: string;
    type: string;
    status: string;
  };
}

export const ScanDialog = ({ open, onClose, onScanSuccess, attendance }: ScanDialogProps) => {
  const [selectedDevice, setSelectedDevice] = useState<MediaDeviceInfo | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [scanning, setScanning] = useState(false);
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
    } else {
      setScanning(false);
    }
  }, [open]);

  const handleScan = (result: any) => {
    if (result) {
      const scannedData = result?.text;
      if (scannedData) {
        playSuccess();
        onScanSuccess(scannedData);
        setScanning(false);
        toast.success("Code scanné avec succès", {
          icon: <Check className="w-4 h-4 text-green-500" />,
        });
      }
    }
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
        <div className="space-y-4">
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

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};