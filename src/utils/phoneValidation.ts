export const isValidMadagascarPhone = (phone: string): boolean => {
  // Accepte tout numéro non vide avec au moins 8 chiffres
  const cleanedPhone = phone.replace(/\D/g, '');
  return cleanedPhone.length >= 8;
};

export const formatPhoneNumber = (phone: string): string => {
  // Garde le format tel quel
  return phone;
};