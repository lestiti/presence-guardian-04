import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ScanType, ScanRecord } from "@/types/attendance";
import { useScanDevice } from "./ScanDeviceManager";
import { ScannerUI } from "./ScannerUI";
import { ScanControls } from "./ScanControls";
import { useScanHandler } from "./useScanHandler";

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
  const [scanType, setScanType] = useState<ScanType>("QR");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const { selectedDevice } = useScanDevice();
  const { handleSuccessfulScan, showSuccess } = useScanHandler({
    onScanSuccess,
    attendance,
    direction,
    existingScans
  });

  useEffect(() => {
    if (open) {
      setIsScanning(true);
      toast.info("Scanner activé", {
        description: scanType === "QR" ? "Placez un QR code devant la caméra" : "Utilisez un scanner de code-barres"
      });
    } else {
      setIsScanning(false);
    }
  }, [open, scanType]);

  // Handle physical barcode scanners
  useEffect(() => {
    let currentCode = "";
    let lastKeyTime = Date.now();
    const SCANNER_TIMEOUT = 50;

    const handleKeyPress = (event: KeyboardEvent) => {
      const currentTime = Date.now();

      if (currentTime - lastKeyTime > SCANNER_TIMEOUT) {
        currentCode = "";
      }
      lastKeyTime = currentTime;

      if (event.key === "Enter" && currentCode) {
        const scanType: ScanType = currentCode.startsWith("FIF") ? "BARCODE" : "QR";
        handleSuccessfulScan(currentCode, scanType);
        currentCode = "";
        return;
      }

      currentCode += event.key;
    };

    if (isScanning) {
      window.addEventListener("keypress", handleKeyPress);
    }

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [isScanning, handleSuccessfulScan]);

  const handleQRResult = (result: any) => {
    if (result) {
      const decodedText = result.getText();
      if (decodedText) {
        handleSuccessfulScan(decodedText, "QR");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>
          {direction === "IN" ? "Check-in" : "Check-out"} - {scanType === "QR" ? "QR Code" : "Code-barres"}
        </DialogTitle>
        <DialogDescription>
          {isScanning ? "Scanner actif - En attente d'un code..." : "Initialisation du scanner..."}
        </DialogDescription>
        
        <div className="space-y-4">
          <ScanControls 
            scanType={scanType}
            onScanTypeChange={setScanType}
          />

          {scanType === "QR" && (
            <ScannerUI
              selectedDevice={selectedDevice}
              isScanning={isScanning}
              showSuccess={showSuccess}
              onResult={handleQRResult}
            />
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