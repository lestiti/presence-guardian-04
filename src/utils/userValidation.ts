import { UserFormData, UserValidationErrors } from "@/types/userTypes";
import { isValidMadagascarPhone } from "./phoneValidation";

export const validateUserForm = (data: Partial<UserFormData>): UserValidationErrors => {
  const errors: UserValidationErrors = {};

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