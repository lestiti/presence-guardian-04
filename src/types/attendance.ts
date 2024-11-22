export type ScanType = "QR" | "BARCODE";

export interface ScanRecord {
  id: string;
  user_id: string;
  attendance_id: string;
  scan_type: ScanType;
  direction: "IN" | "OUT";
  timestamp: string;
  created_at?: string;
  users?: {
    name: string;
    phone: string;
    role: string;
    synods?: {
      name: string;
      color: string;
    };
  };
}

export interface AttendanceRecord {
  id: string;
  title: string;
  date: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceStatus {
  lastScan?: ScanRecord;
  isCheckedIn: boolean;
  canCheckOut: boolean;
}