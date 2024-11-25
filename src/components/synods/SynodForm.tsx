import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { SynodFormData } from "@/types/synod";
import { toast } from "sonner";

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
      toast.error("Le nom du synode est requis");
      return;
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.color)) {
      toast.error("La couleur doit être au format hexadécimal (ex: #FF0000)");
      return;
    }

    onSave();
    setHasChanges(false);
  };

  const updateFormData = (updates: Partial<SynodFormData>) => {
    setFormData({ ...formData, ...updates });
    setHasChanges(true);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du synode</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description || ""}
            onChange={(e) => updateFormData({ description: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Couleur (format hex)</Label>
          <div className="flex gap-2 items-center">
            <Input
              id="color"
              type="text"
              placeholder="#000000"
              value={formData.color}
              onChange={(e) => {
                const value = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                updateFormData({ color: value });
              }}
              className="font-mono"
            />
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: formData.color }}
              aria-label="Aperçu de la couleur"
            />
          </div>
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