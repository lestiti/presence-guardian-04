import { UserData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SynodSelect } from "./SynodSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { isValidMadagascarPhone, formatPhoneNumber } from "@/utils/phoneValidation";
import { toast } from "sonner";

interface UserFormProps {
  formData: Partial<UserData>;
  setFormData: (data: Partial<UserData>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}

export const UserForm = ({ formData, setFormData, onSave, onCancel, isEdit }: UserFormProps) => {
  const [hasChanges, setHasChanges] = useState(false);

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedPhone });
    setHasChanges(true);
  };

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      toast.error("Le nom est requis");
      return;
    }

    if (!isValidMadagascarPhone(formData.phone || '')) {
      toast.error("Numéro de téléphone invalide");
      return;
    }

    if (!formData.synod_id?.trim()) {
      toast.error("Le synode est requis");
      return;
    }

    onSave();
    setHasChanges(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setHasChanges(true);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="+261 34 000 00 00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Fonction</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => {
              setFormData({ ...formData, role: value as UserData["role"] });
              setHasChanges(true);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une fonction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MPIOMANA">MPIOMANA</SelectItem>
              <SelectItem value="MPIANDRY">MPIANDRY</SelectItem>
              <SelectItem value="MPAMPIANATRA">MPAMPIANATRA</SelectItem>
              <SelectItem value="IRAKA">IRAKA</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="synod">Synode</Label>
          <SynodSelect
            value={formData.synod_id}
            onValueChange={(value) => {
              setFormData({ ...formData, synod_id: value });
              setHasChanges(true);
            }}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          {isEdit ? "Modifier" : "Créer"}
        </Button>
      </DialogFooter>
    </div>
  );
};