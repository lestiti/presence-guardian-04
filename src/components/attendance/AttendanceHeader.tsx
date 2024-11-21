import { QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceHeaderProps {
  onStartScan: () => void;
}

export const AttendanceHeader = ({ onStartScan }: AttendanceHeaderProps) => {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-soft border border-white/20 animate-fade-in">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Scanner un code
      </h1>
      <Button onClick={onStartScan} className="bg-primary hover:bg-primary-dark transition-all duration-300">
        <QrCode className="w-4 h-4 mr-2" />
        Scanner
      </Button>
    </div>
  );
};