import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface BackupSettingsProps {
  autoSave: boolean;
  setAutoSave: (checked: boolean) => void;
}

export const BackupSettings = ({ autoSave, setAutoSave }: BackupSettingsProps) => {
  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    toast.success(checked ? "Sauvegarde automatique activée" : "Sauvegarde automatique désactivée");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Sauvegarde</h2>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Sauvegarde automatique</Label>
          <p className="text-sm text-muted-foreground">
            Sauvegarder automatiquement les données de présence
          </p>
        </div>
        <Switch
          checked={autoSave}
          onCheckedChange={handleAutoSaveChange}
        />
      </div>
    </Card>
  );
};