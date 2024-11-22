import { useState } from "react";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { AttendanceSettings } from "@/components/settings/AttendanceSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { BackupSettings } from "@/components/settings/BackupSettings";
import { LanguageSettings } from "@/components/settings/LanguageSettings";
import { AboutSection } from "@/components/settings/AboutSection";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("fr");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [absenceThreshold, setAbsenceThreshold] = useState("3");
  const [scanTimeout, setScanTimeout] = useState("30");
  const [attendanceReminders, setAttendanceReminders] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Paramètres</h1>
      </div>

      <div className="grid gap-6">
        <AppearanceSettings />
        
        <AttendanceSettings
          absenceThreshold={absenceThreshold}
          setAbsenceThreshold={setAbsenceThreshold}
          scanTimeout={scanTimeout}
          setScanTimeout={setScanTimeout}
          attendanceReminders={attendanceReminders}
          setAttendanceReminders={setAttendanceReminders}
        />

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

        <AboutSection />
      </div>
    </div>
  );
};

export default Settings;