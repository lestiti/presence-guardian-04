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
  const { handleSuccessfulScan, showSuccess, processingCode } = useScanHandler({
    onScanSuccess,
    attendance,
    direction,
    existingScans
  });

  useEffect(() => {
    if (open) {
      setIsScanning(true);
    } else {
      setIsScanning(false);
    }
  }, [open]);

  useEffect(() => {
    if (open && isScanning) {
      toast.info(
        scanType === "QR" 
          ? "Placez un QR code devant la caméra" 
          : "Utilisez un scanner de code-barres"
      );
    }
  }, [open, isScanning, scanType]);

  const handleQRResult = async (result: any) => {
    if (!isScanning || processingCode) return;
    
    if (result) {
      const decodedText = result.getText();
      if (decodedText) {
        await handleSuccessfulScan(decodedText, "QR");
      }
    }
  };

  // Handle physical barcode scanners
  useEffect(() => {
    let currentCode = "";
    let lastKeyTime = Date.now();
    const SCANNER_TIMEOUT = 50;

    const handleKeyPress = async (event: KeyboardEvent) => {
      if (!isScanning || processingCode) return;

      const currentTime = Date.now();
      if (currentTime - lastKeyTime > SCANNER_TIMEOUT) {
        currentCode = "";
      }
      lastKeyTime = currentTime;

      if (event.key === "Enter" && currentCode) {
        await handleSuccessfulScan(currentCode, "BARCODE");
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
  }, [isScanning, handleSuccessfulScan, processingCode]);

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
              ? "Scannez un QR code"
              : "Scannez un code-barres"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};