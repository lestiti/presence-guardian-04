import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { isValidMadagascarPhone } from "@/utils/phoneValidation";
import { SynodSelect } from "./SynodSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserData } from "@/types/user";

interface UserFormProps {
  formData: Partial<UserData>;
  setFormData: (data: Partial<UserData>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}

export const UserForm = ({ formData, setFormData, onSave, onCancel, isEdit }: UserFormProps) => {
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!isValidMadagascarPhone(formData.phone)) {
      newErrors.phone = "Le numéro de téléphone doit contenir au moins 8 chiffres";
    }

    if (!formData.role) {
      newErrors.role = "La fonction est requise";
    }

    if (!formData.synod_id) {
      newErrors.synod = "Le synode est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value;
    setFormData({ ...formData, phone: phoneValue });
    setHasChanges(true);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Object.values(errors).forEach(error => {
        if (error) toast.error(error);
      });
      return;
    }

    setIsSubmitting(true);
    try {
      onSave();
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
        <div className="space-y-2">
          <Label htmlFor="name" className={errors.name ? "text-destructive" : ""}>
            Nom
          </Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setHasChanges(true);
              if (errors.name) {
                setErrors(prev => ({ ...prev, name: "" }));
              }
            }}
            className={errors.name ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
            Téléphone
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={handlePhoneChange}
            placeholder="Numéro de téléphone"
            className={errors.phone ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className={errors.role ? "text-destructive" : ""}>
            Fonction
          </Label>
          <Select
            value={formData.role}
            onValueChange={(value) => {
              setFormData({ ...formData, role: value as UserData["role"] });
              setHasChanges(true);
              if (errors.role) {
                setErrors(prev => ({ ...prev, role: "" }));
              }
            }}
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
          <Label htmlFor="synod" className={errors.synod ? "text-destructive" : ""}>
            Synode
          </Label>
          <SynodSelect
            value={formData.synod_id}
            onValueChange={(value) => {
              setFormData({ ...formData, synod_id: value });
              setHasChanges(true);
              if (errors.synod) {
                setErrors(prev => ({ ...prev, synod: "" }));
              }
            }}
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