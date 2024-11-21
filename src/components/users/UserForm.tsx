import { UserData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserFormProps {
  formData: Partial<UserData>;
  setFormData: (data: Partial<UserData>) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}

export const UserForm = ({ formData, setFormData, onSave, onCancel, isEdit }: UserFormProps) => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+261 34 00 000 00"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Fonction</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value as UserData["role"] })}
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
          <Input
            id="synod"
            value={formData.synod}
            onChange={(e) => setFormData({ ...formData, synod: e.target.value })}
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onSave}>
          {isEdit ? "Modifier" : "Créer"}
        </Button>
      </DialogFooter>
    </>
  );
};