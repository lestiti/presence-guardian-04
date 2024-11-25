import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
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
  const handleNotificationChange = async (checked: boolean) => {
    try {
      if (checked && "Notification" in window) {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          setNotifications(true);
          toast.success("Notifications activées");
        } else {
          setNotifications(false);
          toast.error("Permission de notification refusée");
        }
      } else {
        setNotifications(checked);
        toast.success(checked ? "Notifications activées" : "Notifications désactivées");
      }
    } catch (error) {
      console.error("Error changing notification settings:", error);
      toast.error("Erreur lors du changement des paramètres de notification");
    }
  };

  const handleSoundChange = (checked: boolean) => {
    try {
      setSoundEnabled(checked);
      toast.success(checked ? "Sons activés" : "Sons désactivés");
    } catch (error) {
      console.error("Error changing sound settings:", error);
      toast.error("Erreur lors du changement des paramètres sonores");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Notifications</h2>
      </div>

      <div className="space-y-6">
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