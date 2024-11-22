import { ScanRecord, AttendanceStatus } from "@/types/attendance";

export const validateScan = (
  newScan: Omit<ScanRecord, "id">,
  existingScans: ScanRecord[]
): { isValid: boolean; message: string } => {
  const userScans = existingScans.filter(scan => 
    scan.user_id === newScan.user_id && 
    scan.attendance_id === newScan.attendance_id
  );

  const lastScan = userScans[userScans.length - 1];

  if (newScan.direction === "IN") {
    if (lastScan?.direction === "IN") {
      return {
        isValid: false,
        message: "Vous êtes déjà enregistré comme présent"
      };
    }
    return { isValid: true, message: "Check-in effectué avec succès" };
  }

  if (!lastScan || lastScan.direction === "OUT") {
    return {
      isValid: false,
      message: "Vous devez d'abord faire un check-in"
    };
  }

  return { isValid: true, message: "Check-out effectué avec succès" };
};

export const getCurrentStatus = (
  user_id: string,
  attendance_id: string,
  scans: ScanRecord[]
): AttendanceStatus => {
  const userScans = scans.filter(scan => 
    scan.user_id === user_id && 
    scan.attendance_id === attendance_id
  );

  const lastScan = userScans[userScans.length - 1];

  return {
    lastScan,
    isCheckedIn: lastScan?.direction === "IN",
    canCheckOut: lastScan?.direction === "IN"
  };
};