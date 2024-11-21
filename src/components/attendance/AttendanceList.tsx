import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, QrCode } from "lucide-react";
import { useSynodStore } from "@/stores/synodStore";
import { useState } from "react";
import { ScanDialog } from "./ScanDialog";
import { toast } from "sonner";

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

  const getSynodName = (synodId: string) => {
    const synod = synods.find(s => s.id === synodId);
    return synod ? synod.name : synodId;
  };

  const handleScanSuccess = async (code: string) => {
    try {
      // Ici, vous pouvez implémenter la logique pour enregistrer le scan
      // Par exemple, faire un appel API pour enregistrer l'entrée/sortie
      console.log("Code scanné:", code, "pour le pointage:", scanningAttendance?.id);
      toast.success("Pointage enregistré avec succès");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du scan:", error);
      toast.error("Erreur lors de l'enregistrement du pointage");
    }
    setScanningAttendance(null);
  };

  return (
    <>
      <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-soft border border-white/20 animate-fade-in">
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
                        onClick={() => setScanningAttendance(attendance)}
                        disabled={attendance.status === "TERMINE"}
                      >
                        <QrCode className="w-4 h-4" />
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
        attendance={scanningAttendance as Attendance}
      />
    </>
  );
};