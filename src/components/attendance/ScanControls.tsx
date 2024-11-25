import { Button } from "@/components/ui/button";
import { QrCode, Barcode } from "lucide-react";
import { ScanType } from "@/types/attendance";

interface ScanControlsProps {
  scanType: ScanType;
  onScanTypeChange: (type: ScanType) => void;
}

export const ScanControls = ({ scanType, onScanTypeChange }: ScanControlsProps) => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Button
        variant={scanType === "QR" ? "default" : "outline"}
        onClick={() => onScanTypeChange("QR")}
        className="flex items-center space-x-2"
      >
        <QrCode className="w-4 h-4" />
        <span>QR Code</span>
      </Button>
      <Button
        variant={scanType === "BARCODE" ? "default" : "outline"}
        onClick={() => onScanTypeChange("BARCODE")}
        className="flex items-center space-x-2"
      >
        <Barcode className="w-4 h-4" />
        <span>Code-barres</span>
      </Button>
    </div>
  );
};