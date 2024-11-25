import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Reset form state when opening/closing
    return () => {
      setHasChanges(false);
      setErrors({});
    };
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Le nom du synode est requis";
    }

    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (!hexColorRegex.test(formData.color)) {
      newErrors.color = "La couleur doit être au format hexadécimal (ex: #FF0000)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Object.values(errors).forEach(error => {
        toast.error(error);
      });
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
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name}</span>
          )}
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
              className={`font-mono ${errors.color ? "border-red-500" : ""}`}
            />
            <div 
              className="w-10 h-10 rounded border"
              style={{ backgroundColor: formData.color }}
              aria-label="Aperçu de la couleur"
            />
          </div>
          {errors.color && (
            <span className="text-sm text-red-500">{errors.color}</span>
          )}
        </div>
      </div>
      <DialogFooter>
        <Button 
          variant="outline" 
          onClick={onCancel}
          type="button"
        >
          Annuler
        </Button>
        <Button 
          onClick={handleSubmit}
          type="submit"
          disabled={!hasChanges}
        >
          {isEdit ? "Modifier" : "Créer"}
        </Button>
      </DialogFooter>
    </div>
  );
};