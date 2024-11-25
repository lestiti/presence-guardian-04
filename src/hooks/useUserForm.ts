import { useState } from "react";
import { UserFormData, UserValidationErrors } from "@/types/userTypes";
import { validateUserForm } from "@/utils/userValidation";
import { toast } from "sonner";
import { useCreateUser, useUpdateUser } from "./useUserMutations";

export const useUserForm = (onSuccess: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<UserValidationErrors>({});
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const handleSubmit = async (formData: Partial<UserFormData>, userId?: string) => {
    const validationErrors = validateUserForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach(error => {
        if (error) toast.error(error);
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (userId) {
        await updateUser.mutateAsync({
          id: userId,
          ...formData
        });
      } else {
        await createUser.mutateAsync(formData as UserFormData);
      }
      onSuccess();
      setErrors({});
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    errors,
    handleSubmit,
    setErrors
  };
};