// Fonction pour générer un code unique pour le QR code
export const generateUniqueQRCode = (userId: string): string => {
  return `user-${userId}-${Date.now()}`;
};

// Fonction pour générer un code barre unique commençant par FIF
export const generateUniqueBarcode = (userId: string): string => {
  // Prend l'ID utilisateur, le convertit en nombre et ajoute un timestamp
  const numericPart = userId.replace(/\D/g, '');
  const timestamp = Date.now().toString().slice(-4);
  return `FIF${numericPart.padStart(4, '0')}${timestamp}`;
};