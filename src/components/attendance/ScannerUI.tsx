import { QrReader } from "react-qr-reader";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ScannerUIProps {
  selectedDevice: MediaDeviceInfo | null;
  isScanning: boolean;
  showSuccess: boolean;
  onResult: (result: any) => void;
}

export const ScannerUI = ({ selectedDevice, isScanning, showSuccess, onResult }: ScannerUIProps) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isScanning) {
      setKey(prev => prev + 1);
    }
  }, [isScanning]);

  if (!selectedDevice) return null;

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg">
      {isScanning && (
        <QrReader
          key={key}
          constraints={{
            deviceId: selectedDevice.deviceId,
            facingMode: "environment",
            aspectRatio: 1
          }}
          onResult={(result, error) => {
            if (result?.getText()) {
              onResult(result);
            }
          }}
          className="w-full h-full"
          scanDelay={1000}
          videoId="qr-video"
        />
      )}
      <div className={`absolute inset-0 pointer-events-none border-4 ${
        isScanning ? 'border-primary animate-pulse' : 'border-gray-300'
      } rounded-lg`} />
      {showSuccess && (
        <div className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm">
          <CheckCircle2 className="w-24 h-24 text-green-500 animate-in zoom-in duration-300" />
        </div>
      )}
      {isScanning && (
        <div className="absolute top-2 right-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </div>
  );
};