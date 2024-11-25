// Generate a simple numeric identifier from the UUID
const generateNumericId = (userId: string): string => {
  // Take first 8 chars of UUID and convert to number
  const numericId = userId.replace(/\D/g, '').slice(0, 8);
  return numericId.padStart(8, '0');
};

// Fonction pour générer un code unique pour le QR code
export const generateUniqueQRCode = (userId: string): string => {
  const numericId = generateNumericId(userId);
  return `FIF${numericId}`;
};

// Fonction pour générer un code barre unique commençant par FIF
export const generateUniqueBarcode = (userId: string): string => {
  const numericId = generateNumericId(userId);
  return `FIF${numericId}`;
};