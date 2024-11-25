// Fonction pour générer un code unique pour le QR code
export const generateUniqueQRCode = (userId: string): string => {
  return `FIFS-${userId}-${Date.now()}`;
};

// Fonction pour générer un code barre unique commençant par FIF
export const generateUniqueBarcode = (userId: string): string => {
  // Prend l'ID utilisateur et le convertit en nombre
  const numericPart = userId.replace(/\D/g, '').slice(0, 8);
  const timestamp = Date.now().toString().slice(-4);
  return `FIF${numericPart.padStart(8, '0')}${timestamp}`;
};