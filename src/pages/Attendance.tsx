import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { AttendanceHeader } from "@/components/attendance/AttendanceHeader";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { AttendanceList } from "@/components/attendance/AttendanceList";

interface Attendance {
  id: string;
  date: string;
  synod: string;
  type: string;
  status: "EN_COURS" | "TERMINE";
}

const Attendance = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [attendances, setAttendances] = useState<Attendance[]>([]);

  const handleNewAttendance = () => {
    setSelectedAttendance(null);
    setShowDialog(true);
  };

  const handleSaveAttendance = (formData: any) => {
    const newAttendance: Attendance = {
      ...formData,
      id: (attendances.length + 1).toString(),
      status: "EN_COURS",
    };
    setAttendances([...attendances, newAttendance]);
    setShowDialog(false);
    toast.success("Pointage créé avec succès");
  };

  const handleEditAttendance = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setShowDialog(true);
  };

  const handleDeleteAttendance = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAttendance) {
      setAttendances(attendances.filter(a => a.id !== selectedAttendance.id));
      toast.success("Pointage supprimé avec succès");
    }
    setShowDeleteDialog(false);
    setSelectedAttendance(null);
  };

  const handleScanAttendance = (attendance: Attendance) => {
    toast.info("Fonctionnalité de scan en cours de développement");
  };

  return (
    <div className="space-y-6">
      <AttendanceHeader onNewAttendance={handleNewAttendance} />

      <AttendanceList
        attendances={attendances}
        onEdit={handleEditAttendance}
        onDelete={handleDeleteAttendance}
        onScan={handleScanAttendance}
      />

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <AttendanceForm
            onSave={handleSaveAttendance}
            onCancel={() => setShowDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement ce pointage
              et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Attendance;