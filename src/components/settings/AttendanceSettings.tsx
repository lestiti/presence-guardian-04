import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AttendanceSettingsProps {
  absenceThreshold: string;
  setAbsenceThreshold: (value: string) => void;
  scanTimeout: string;
  setScanTimeout: (value: string) => void;
  attendanceReminders: boolean;
  setAttendanceReminders: (checked: boolean) => void;
}

export const AttendanceSettings = ({
  absenceThreshold,
  setAbsenceThreshold,
  scanTimeout,
  setScanTimeout,
  attendanceReminders,
  setAttendanceReminders
}: AttendanceSettingsProps) => {
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
  );
};