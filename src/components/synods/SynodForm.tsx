import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { SynodFormData } from "@/types/synod";

interface SynodFormProps {
  formData: SynodFormData;
  setFormData: (data: SynodFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}

export const SynodForm = ({ formData, setFormData, onSave, onCancel, isEdit }: SynodFormProps) => {
  const [hasChanges, setHasChanges] = useState(false);

  const handleSubmit = () => {
    if (!formData.name?.trim()) {
      return;
    }
    onSave();
    setHasChanges(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du synode</Label>
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
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setHasChanges(true);
            }}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => {
              setFormData({ ...formData, color: e.target.value });
              setHasChanges(true);
            }}
            className="h-10 px-2 py-1"
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