import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface NotificationSettingsProps {
  notifications: boolean;
  setNotifications: (checked: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (checked: boolean) => void;
}

export const NotificationSettings = ({
  notifications,
  setNotifications,
  soundEnabled,
  setSoundEnabled
}: NotificationSettingsProps) => {
  const handleNotificationChange = (checked: boolean) => {
    setNotifications(checked);
    toast.success(checked ? "Notifications activées" : "Notifications désactivées");
  };

  const handleSoundChange = (checked: boolean) => {
    setSoundEnabled(checked);
    toast.success(checked ? "Sons activés" : "Sons désactivés");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Notifications push</Label>
            <p className="text-sm text-muted-foreground">
              Recevoir des notifications pour les événements importants
            </p>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={handleNotificationChange}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Sons</Label>
            <p className="text-sm text-muted-foreground">
              Activer les sons de l'application
            </p>
          </div>
          <Switch
            checked={soundEnabled}
            onCheckedChange={handleSoundChange}
          />
        </div>
      </div>
    </Card>
  );
};