import { Grid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessRole } from "@/types/access";
import { SynodExcelUpload } from "./SynodExcelUpload";

interface SynodsHeaderProps {
  role: AccessRole;
  setShowDialog: (show: boolean) => void;
}

export const SynodsHeader = ({ role, setShowDialog }: SynodsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-secondary">Gestion des Synodes</h1>
      {role === 'super_admin' && (
        <div className="flex gap-4">
          <SynodExcelUpload />
          <Button 
            className="bg-primary hover:bg-primary/90 transition-colors" 
            onClick={() => setShowDialog(true)}
          >
            <Grid className="w-4 h-4 mr-2" />
            Nouveau Synode
          </Button>
        </div>
      )}
    </div>
  );
};