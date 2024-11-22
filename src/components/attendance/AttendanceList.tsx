import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, LogIn, LogOut, MessageSquare } from "lucide-react";
import { useSynodStore } from "@/stores/synodStore";
import { useState } from "react";
import { ScanDialog } from "./ScanDialog";
import { toast } from "sonner";
import { ScanRecord } from "@/types/attendance";
import { AttendanceNoteDialog } from "./AttendanceNoteDialog";
import { useTheme } from "@/hooks/useTheme";

interface Attendance {
  id: string;
  date: string;
  synod: string;
  type: string;
  status: "EN_COURS" | "TERMINE";
}

interface AttendanceListProps {
  attendances: Attendance[];
  onEdit: (attendance: Attendance) => void;
  onDelete: (attendance: Attendance) => void;
}

export const AttendanceList = ({ attendances, onEdit, onDelete }: AttendanceListProps) => {
  const { synods } = useSynodStore();
  const [scanningAttendance, setScanningAttendance] = useState<Attendance | null>(null);
  const [scanDirection, setScanDirection] = useState<"IN" | "OUT">("IN");
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const { theme } = useTheme();

  const getSynodName = (synodId: string) => {
    const synod = synods.find(s => s.id === synodId);
    return synod ? synod.name : synodId;
  };

  const handleScanSuccess = async (scanRecord: Omit<ScanRecord, "id">) => {
    try {
      const newScan: ScanRecord = {
        ...scanRecord,
        id: Date.now().toString() // Utilisez un vrai générateur d'ID en production
      };
      setScans([...scans, newScan]);
      setScanningAttendance(null);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du scan:", error);
      toast.error("Erreur lors de l'enregistrement du pointage");
    }
  };

  const handleAddNote = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setShowNoteDialog(true);
  };

  const handleNoteSubmit = (note: string) => {
    if (selectedAttendance) {
      // Ici vous pouvez implémenter la logique pour sauvegarder la note
      toast.success("Note ajoutée avec succès");
      setShowNoteDialog(false);
    }
  };

  // Vérification des absences répétées
  const checkAbsences = (attendance: Attendance) => {
    const absenceCount = scans.filter(scan => 
      scan.attendance_id === attendance.id && scan.direction === "OUT"
    ).length;

    if (absenceCount >= 3) {
      toast.warning(`Attention: Absences répétées détectées pour cet événement`, {
        description: "Veuillez vérifier la situation."
      });
    }
  };

  return (
    <>
      <div className={`bg-white/50 backdrop-blur-sm rounded-lg shadow-soft border border-white/20 animate-fade-in ${
        theme === 'dark' ? 'dark:bg-gray-800/50 dark:border-gray-700/20' : ''
      }`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Synode</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendances.map((attendance) => (
                <TableRow key={attendance.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <TableCell>{new Date(attendance.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getSynodName(attendance.synod)}</TableCell>
                  <TableCell>{attendance.type}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      attendance.status === "EN_COURS" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {attendance.status === "EN_COURS" ? "En cours" : "Terminé"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setScanningAttendance(attendance);
                          setScanDirection("IN");
                        }}
                        disabled={attendance.status === "TERMINE"}
                      >
                        <LogIn className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setScanningAttendance(attendance);
                          setScanDirection("OUT");
                        }}
                        disabled={attendance.status === "TERMINE"}
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onEdit(attendance)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => onDelete(attendance)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleAddNote(attendance)}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ScanDialog
        open={!!scanningAttendance}
        onClose={() => setScanningAttendance(null)}
        onScanSuccess={handleScanSuccess}
        attendance={scanningAttendance}
        direction={scanDirection}
        existingScans={scans}
      />

      <AttendanceNoteDialog
        open={showNoteDialog}
        onClose={() => setShowNoteDialog(false)}
        onSubmit={handleNoteSubmit}
      />
    </>
  );
};
