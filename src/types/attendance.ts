export type ScanType = "QR" | "BARCODE";

export interface ScanRecord {
  id: string;
  userId: string;
  attendanceId: string;
  scanType: ScanType;
  direction: "IN" | "OUT";
  timestamp: Date;
}

export interface AttendanceStatus {
  lastScan?: ScanRecord;
  isCheckedIn: boolean;
  canCheckOut: boolean;
}