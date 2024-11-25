import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { BackupSettings } from "@/components/settings/BackupSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { AboutSection } from "@/components/settings/AboutSection";
import { ActivityLog } from "@/components/settings/ActivityLog";

const Settings = () => {
  // Load settings from localStorage with default values
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notifications") ?? "true");
    } catch {
      return true;
    }
  });

  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("language") ?? "fr";
    } catch {
      return "fr";
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("soundEnabled") ?? "true");
    } catch {
      return true;
    }
  });

  const [autoSave, setAutoSave] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("autoSave") ?? "true");
    } catch {
      return true;
    }
  });

  // Sample activity logs
  const [logs] = useState([
    {
      id: "1",
      type: "presence" as const,
      description: "Pointage effectué",
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "settings" as const,
      description: "Paramètres mis à jour",
      timestamp: new Date(),
    },
  ]);

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("notifications", JSON.stringify(notifications));
      localStorage.setItem("language", language);
      localStorage.setItem("soundEnabled", JSON.stringify(soundEnabled));
      localStorage.setItem("autoSave", JSON.stringify(autoSave));
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Erreur lors de la sauvegarde des paramètres");
    }
  }, [notifications, language, soundEnabled, autoSave]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      <div className="grid gap-6">
        <AppearanceSettings />
        
        <NotificationSettings
          notifications={notifications}
          setNotifications={setNotifications}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
        />

        <BackupSettings
          autoSave={autoSave}
          setAutoSave={setAutoSave}
        />

        <LanguageSettings
          language={language}
          setLanguage={setLanguage}
        />

        <ActivityLog logs={logs} />

        <AboutSection />
      </div>
    </div>
  );
};

export default Settings;