export const isValidMadagascarPhone = (phone: string): boolean => {
  // Format attendu: +261 XX XXX XX
  const phoneRegex = /^\+261\s?(32|33|34|38)\s?\d{3}\s?\d{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return `+261${cleaned.slice(1)}`;
  }
  return phone;
};
