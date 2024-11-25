import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserData } from "@/types/user";
import { SynodSelect } from "./SynodSelect";
import { FormField } from "./FormField";
import { validateUserForm, UserFormErrors } from "@/utils/userValidation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserFormProps {
  formData: Partial<UserData>;
  setFormData: (data: Partial<UserData>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}

export const UserForm = ({ 
  formData, 
  setFormData, 
  onSave, 
  onCancel, 
  isEdit 
}: UserFormProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const updateField = (field: keyof UserData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
    if (errors[field as keyof UserFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
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
      await onSave();
      setHasChanges(false);
      setErrors({});
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 py-4">
        <FormField
          id="name"
          label="Nom"
          value={formData.name || ""}
          onChange={(value) => updateField('name', value)}
          error={errors.name}
          disabled={isSubmitting}
        />

        <FormField
          id="phone"
          label="Téléphone"
          value={formData.phone || ""}
          onChange={(value) => updateField('phone', value)}
          error={errors.phone}
          disabled={isSubmitting}
          type="tel"
        />

        <div className="space-y-2">
          <Select
            value={formData.role}
            onValueChange={(value) => updateField('role', value)}
          >
            <SelectTrigger className={errors.role ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionner une fonction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MPIOMANA">MPIOMANA</SelectItem>
              <SelectItem value="MPIANDRY">MPIANDRY</SelectItem>
              <SelectItem value="MPAMPIANATRA">MPAMPIANATRA</SelectItem>
              <SelectItem value="IRAKA">IRAKA</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && (
            <p className="text-sm text-destructive">{errors.role}</p>
          )}
        </div>

        <div className="space-y-2">
          <SynodSelect
            value={formData.synod_id}
            onValueChange={(value) => updateField('synod_id', value)}
            className={errors.synod ? "border-destructive" : ""}
          />
          {errors.synod && (
            <p className="text-sm text-destructive">{errors.synod}</p>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
          type="button"
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          type="submit"
          disabled={!hasChanges || isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : isEdit ? "Modifier" : "Créer"}
        </Button>
      </DialogFooter>
    </div>
  );
};