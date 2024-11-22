import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/useTheme";
import { Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("fr");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleNotificationChange = (checked: boolean) => {
    setNotifications(checked);
    toast.success(checked ? "Notifications activées" : "Notifications désactivées");
  };

  const handleSoundChange = (checked: boolean) => {
    setSoundEnabled(checked);
    toast.success(checked ? "Sons activés" : "Sons désactivés");
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success("Langue modifiée");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Paramètres</h1>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Apparence</h2>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Thème</Label>
              <p className="text-sm text-muted-foreground">
                Choisissez le thème de l'application
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("light")}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("dark")}
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="icon"
                onClick={() => setTheme("system")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

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

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Langue</h2>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Langue de l'application</Label>
              <p className="text-sm text-muted-foreground">
                Choisissez la langue de l'interface
              </p>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="mg">Malagasy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">À propos</h2>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Version: 1.0.0
            </p>
            <p className="text-sm text-muted-foreground">
              © 2024 FPVM Checking. Tous droits réservés.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;