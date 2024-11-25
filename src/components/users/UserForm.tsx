import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { UserFormProps } from "@/types/userTypes";
import { SynodSelect } from "./SynodSelect";
import { FormField } from "./FormField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserForm } from "@/hooks/useUserForm";

export const UserForm = ({ 
  formData, 
  setFormData, 
  onSave, 
  onCancel, 
  isEdit 
}: UserFormProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const { isSubmitting, errors, handleSubmit } = useUserForm(onSave);

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

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    setHasChanges(true);
  };

  const handleFormSubmit = async () => {
    await handleSubmit(formData);
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
          onClick={handleFormSubmit}
          type="submit"
          disabled={!hasChanges || isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : isEdit ? "Modifier" : "Créer"}
        </Button>
      </DialogFooter>
    </div>
  );
};