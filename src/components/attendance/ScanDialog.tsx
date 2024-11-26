import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
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

  const [barcodeBuffer, setBarcodeBuffer] = useState<string>("");
  const [lastScanTime, setLastScanTime] = useState<number>(0);

  // Reset scanning state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setIsScanning(true);
      console.log("Dialog opened, scanning started");
    } else {
      setIsScanning(false);
      setBarcodeBuffer("");
      console.log("Dialog closed, scanning stopped");
    }
  }, [open]);

  // Show instructions when scanning starts
  useEffect(() => {
    if (open && isScanning) {
      const message = scanType === "QR" 
        ? "Placez un QR code devant la caméra" 
        : "Utilisez un scanner de code-barres";
      toast.info(message);
      console.log(`Scanning instructions shown: ${message}`);
    }
  }, [open, isScanning, scanType]);

  const handleQRResult = async (result: any) => {
    if (!isScanning || processingCode) {
      console.log("Scan ignored - scanning disabled or processing in progress");
      return;
    }
    
    if (result) {
      const decodedText = result.getText();
      if (decodedText) {
        console.log("QR code detected:", decodedText);
        await handleSuccessfulScan(decodedText, "QR");
      }
    }
  };

  // Improved barcode handling with debounce and validation
  const processBarcodeInput = useCallback(async (code: string) => {
    const currentTime = Date.now();
    const MINIMUM_SCAN_INTERVAL = 1000; // 1 second minimum between scans

    if (currentTime - lastScanTime < MINIMUM_SCAN_INTERVAL) {
      console.log("Scan ignored - too soon after last scan");
      return;
    }

    if (!code.trim() || code.length < 3) {
      console.log("Invalid barcode - too short or empty");
      return;
    }

    setLastScanTime(currentTime);
    console.log("Processing barcode:", code);
    await handleSuccessfulScan(code, "BARCODE");
    setBarcodeBuffer("");
  }, [handleSuccessfulScan, lastScanTime]);

  // Enhanced physical barcode scanner handling
  useEffect(() => {
    const BARCODE_TIMEOUT = 30; // Timeout in ms between keystrokes

    let keypressTimer: NodeJS.Timeout;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isScanning || processingCode || scanType !== "BARCODE") {
        return;
      }

      // Prevent default behavior for Enter key to avoid form submissions
      if (event.key === "Enter") {
        event.preventDefault();
        
        if (barcodeBuffer.trim()) {
          processBarcodeInput(barcodeBuffer);
        }
        return;
      }

      // Clear timeout if it exists
      if (keypressTimer) {
        clearTimeout(keypressTimer);
      }

      // Add character to buffer
      setBarcodeBuffer(prev => prev + event.key);

      // Set new timeout
      keypressTimer = setTimeout(() => {
        if (barcodeBuffer.length > 0) {
          processBarcodeInput(barcodeBuffer);
        }
      }, BARCODE_TIMEOUT);
    };

    if (isScanning && scanType === "BARCODE") {
      window.addEventListener("keypress", handleKeyPress);
      console.log("Barcode scanner listener activated");
    }

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      if (keypressTimer) {
        clearTimeout(keypressTimer);
      }
      console.log("Barcode scanner listener deactivated");
    };
  }, [isScanning, processingCode, scanType, barcodeBuffer, processBarcodeInput]);

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
            onScanTypeChange={(type) => {
              setScanType(type);
              setBarcodeBuffer("");
              console.log("Scan type changed to:", type);
            }}
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