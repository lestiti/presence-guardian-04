import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { ScanRecord } from "@/types/attendance";

interface AttendanceHistoryProps {
  scans: ScanRecord[];
  userName: string;
}

export const AttendanceHistory = ({ scans, userName }: AttendanceHistoryProps) => {
  const sortedScans = [...scans].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Historique des présences - {userName}</h3>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {sortedScans.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          Aucun scan enregistré
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Direction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedScans.map((scan) => (
              <TableRow key={scan.id}>
                <TableCell>
                  {new Date(scan.timestamp).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {new Date(scan.timestamp).toLocaleTimeString()}
                  </div>
                </TableCell>
                <TableCell>{scan.scan_type}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    scan.direction === "IN" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {scan.direction}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};