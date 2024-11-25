export const isValidMadagascarPhone = (phone: string): boolean => {
  // Accept any number with at least 8 digits
  const cleanedPhone = phone.replace(/\D/g, '');
  return cleanedPhone.length >= 8;
};

export const formatPhoneNumber = (phone: string): string => {
  // Garde le format tel quel
  return phone;
};