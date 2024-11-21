import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { SynodSelect } from "@/components/users/SynodSelect";
import { toast } from "sonner";

interface AttendanceFormData {
  date: string;
  synod: string;
  type: string;
}

interface AttendanceFormProps {
  onSave: (data: AttendanceFormData) => void;
  onCancel: () => void;
}

export const AttendanceForm = ({ onSave, onCancel }: AttendanceFormProps) => {
  const [formData, setFormData] = useState<AttendanceFormData>({
    date: new Date().toISOString().split('T')[0],
    synod: "",
    type: "CULTE",
  });

  const handleSubmit = () => {
    if (!formData.synod) {
      toast.error("Veuillez sélectionner un synode");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="synod">Synode</Label>
          <SynodSelect
            value={formData.synod}
            onValueChange={(value) => setFormData({ ...formData, synod: value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="CULTE">Culte</option>
            <option value="REUNION">Réunion</option>
            <option value="FORMATION">Formation</option>
          </select>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={handleSubmit}>
          Créer
        </Button>
      </DialogFooter>
    </div>
  );
};