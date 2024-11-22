import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/hooks/useTheme";
import { Monitor, Moon, Sun, Bell, Volume2, Database, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("fr");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [absenceThreshold, setAbsenceThreshold] = useState("3");
  const [scanTimeout, setScanTimeout] = useState("30");
  const [attendanceReminders, setAttendanceReminders] = useState(true);

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

  const handleAutoSaveChange = (checked: boolean) => {
    setAutoSave(checked);
    toast.success(checked ? "Sauvegarde automatique activée" : "Sauvegarde automatique désactivée");
  };

  const handleAbsenceThresholdChange = (value: string) => {
    setAbsenceThreshold(value);
    toast.success("Seuil d'absences modifié");
  };

  const handleScanTimeoutChange = (value: string) => {
    setScanTimeout(value);
    toast.success("Délai de scan modifié");
  };

  const handleAttendanceRemindersChange = (checked: boolean) => {
    setAttendanceReminders(checked);
    toast.success(checked ? "Rappels de présence activés" : "Rappels de présence désactivés");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres</h1>
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
                onClick={() => toggleTheme()}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                size="icon"
                onClick={() => toggleTheme()}
              >
                <Moon className="h-4 w-4" />
              </Button>
              <Button
                variant={theme === "system" ? "default" : "outline"}
                size="icon"
                onClick={() => toggleTheme()}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Gestion des Présences</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Seuil d'absences</Label>
                <p className="text-sm text-muted-foreground">
                  Nombre d'absences avant notification
                </p>
              </div>
              <Select value={absenceThreshold} onValueChange={handleAbsenceThresholdChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 absences</SelectItem>
                  <SelectItem value="3">3 absences</SelectItem>
                  <SelectItem value="4">4 absences</SelectItem>
                  <SelectItem value="5">5 absences</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Délai de scan</Label>
                <p className="text-sm text-muted-foreground">
                  Temps maximum pour scanner (en secondes)
                </p>
              </div>
              <Select value={scanTimeout} onValueChange={handleScanTimeoutChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 sec</SelectItem>
                  <SelectItem value="30">30 sec</SelectItem>
                  <SelectItem value="45">45 sec</SelectItem>
                  <SelectItem value="60">60 sec</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Rappels de présence</Label>
                <p className="text-sm text-muted-foreground">
                  Activer les rappels pour les événements
                </p>
              </div>
              <Switch
                checked={attendanceReminders}
                onCheckedChange={handleAttendanceRemindersChange}
              />
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