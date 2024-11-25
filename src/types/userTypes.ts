import { UserRole } from "./user";

export interface UserFormData {
  name: string;
  phone: string;
  role: UserRole;
  synod_id: string;
}

export interface UserFormProps {
  formData: Partial<UserFormData>;
  setFormData: (data: Partial<UserFormData>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}

export interface UserValidationErrors {
  name?: string;
  phone?: string;
  role?: string;
  synod?: string;
}