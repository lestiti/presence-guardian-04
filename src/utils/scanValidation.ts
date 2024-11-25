import { ScanRecord, AttendanceStatus } from "@/types/attendance";

export const validateScan = (
  newScan: Omit<ScanRecord, "id">,
  existingScans: ScanRecord[]
): { isValid: boolean; message: string } => {
  console.log("Validating scan:", newScan);
  console.log("Existing scans:", existingScans);
  
  const userScans = existingScans.filter(scan => 
    scan.user_id === newScan.user_id && 
    scan.attendance_id === newScan.attendance_id
  );

  const lastScan = userScans[userScans.length - 1];
  console.log("Last scan for user:", lastScan);

  if (newScan.direction === "IN") {
    if (lastScan?.direction === "IN") {
      console.log("Validation failed: User already checked in");
      return {
        isValid: false,
        message: "Vous êtes déjà enregistré comme présent"
      };
    }
    console.log("Validation passed: Check-in allowed");
    return { isValid: true, message: "Check-in effectué avec succès" };
  }

  if (!lastScan || lastScan.direction === "OUT") {
    console.log("Validation failed: No check-in found before check-out");
    return {
      isValid: false,
      message: "Vous devez d'abord faire un check-in"
    };
  }

  console.log("Validation passed: Check-out allowed");
  return { isValid: true, message: "Check-out effectué avec succès" };
};

export const getCurrentStatus = (
  user_id: string,
  attendance_id: string,
  scans: ScanRecord[]
): AttendanceStatus => {
  console.log("Getting current status for user:", user_id);
  
  const userScans = scans.filter(scan => 
    scan.user_id === user_id && 
    scan.attendance_id === attendance_id
  );

  const lastScan = userScans[userScans.length - 1];
  console.log("User scans:", userScans);
  console.log("Last scan:", lastScan);

  return {
    lastScan,
    isCheckedIn: lastScan?.direction === "IN",
    canCheckOut: lastScan?.direction === "IN"
  };
};