// Fonction pour générer un code unique pour le QR code
export const generateUniqueQRCode = (userId: string): string => {
  return `user-${userId}`;
};

// Fonction pour générer un code barre unique commençant par FIF
export const generateUniqueBarcode = (userId: string): string => {
  // Prend l'ID utilisateur et le convertit en nombre
  const numericPart = userId.replace(/\D/g, '');
  return `FIF${numericPart.padStart(8, '0')}`;
};