import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { toast } from "sonner";

interface BackupSettingsProps {
  autoSave: boolean;
  setAutoSave: (checked: boolean) => void;
}

export const BackupSettings = ({ autoSave, setAutoSave }: BackupSettingsProps) => {
  const handleAutoSaveChange = (checked: boolean) => {
    try {
      setAutoSave(checked);
      toast.success(checked ? "Sauvegarde automatique activée" : "Sauvegarde automatique désactivée");
    } catch (error) {
      console.error("Error changing auto-save settings:", error);
      toast.error("Erreur lors du changement des paramètres de sauvegarde");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Save className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Sauvegarde</h2>
      </div>

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