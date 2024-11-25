import { UserData } from "@/types/user";
import { isValidMadagascarPhone } from "./phoneValidation";

export type UserFormErrors = {
  name?: string;
  phone?: string;
  role?: string;
  synod?: string;
};

export const validateUserForm = (data: Partial<UserData>): UserFormErrors => {
  const errors: UserFormErrors = {};

  if (!data.name?.trim()) {
    errors.name = "Le nom est requis";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Le numéro de téléphone est requis";
  } else if (!isValidMadagascarPhone(data.phone)) {
    errors.phone = "Le numéro de téléphone doit contenir au moins 8 chiffres";
  }

  if (!data.role) {
    errors.role = "La fonction est requise";
  }

  if (!data.synod_id) {
    errors.synod = "Le synode est requis";
  }

  return errors;
};