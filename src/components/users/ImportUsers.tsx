import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImportPreview } from "./ImportPreview";
import { ImportValidation } from "./ImportValidation";
import { UserData } from "@/types/user";
import { toast } from "sonner";
import mammoth from "mammoth";
import { isValidMadagascarPhone } from "@/utils/phoneValidation";

interface ImportUsersProps {
  onImport: (users: UserData[]) => void;
  existingSynods: string[];
}

export const ImportUsers = ({ onImport, existingSynods }: ImportUsersProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [parsedUsers, setParsedUsers] = useState<Partial<UserData>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const parseWordDocument = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      // Analyse du texte pour extraire les utilisateurs
      const users = text.split("\n")
        .filter(line => line.trim().length > 0)
        .map(line => {
          const [anarana, fanampiny, finday, asa, synode_id] = line.split("\t");
          return {
            name: `${anarana || ""} ${fanampiny || ""}`.trim(),
            phone: finday?.trim() || "",
            role: mapRole(asa?.trim()),
            synod_id: synode_id?.trim() || "",
          };
        })
        .filter(user => user.name || user.phone);

      validateUsers(users);
      setParsedUsers(users);
    } catch (error) {
      toast.error("Erreur lors de la lecture du fichier");
      console.error(error);
    }
  };

  const mapRole = (role?: string): UserData["role"] => {
    const roleMap: Record<string, UserData["role"]> = {
      "mpiomana": "MPIOMANA",
      "mpampianatra": "MPAMPIANATRA",
      "iraka": "IRAKA",
      "mpiandry": "MPIANDRY",
    };
    return roleMap[role?.toLowerCase() || ""] || "MPIOMANA";
  };

  const validateUsers = (users: Partial<UserData>[]) => {
    const newErrors: string[] = [];
    const phoneNumbers = new Set();

    users.forEach((user, index) => {
      if (!user.name?.trim()) {
        newErrors.push(`Ligne ${index + 1}: Anarana tsy misy`);
      }
      if (!user.phone || !isValidMadagascarPhone(user.phone)) {
        newErrors.push(`Ligne ${index + 1}: Finday tsy mety`);
      }
      if (phoneNumbers.has(user.phone)) {
        newErrors.push(`Ligne ${index + 1}: Finday efa misy`);
      }
      phoneNumbers.add(user.phone);
      if (!existingSynods.includes(user.synod_id || "")) {
        newErrors.push(`Ligne ${index + 1}: Synode tsy mety`);
      }
    });

    setErrors(newErrors);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".docx")) {
      await parseWordDocument(file);
      setShowDialog(true);
    } else {
      toast.error("Veuillez sélectionner un fichier .docx");
    }
  };

  const handleImport = () => {
    if (errors.length > 0) {
      toast.error("Veuillez corriger les erreurs avant d'importer");
      return;
    }

    const validUsers = parsedUsers.filter(user => 
      user.name && user.phone && user.role && user.synod_id
    ) as UserData[];

    onImport(validUsers);
    setShowDialog(false);
    setParsedUsers([]);
    setErrors([]);
    toast.success("Importation réussie");
  };

  return (
    <>
      <div className="relative">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          className="hidden"
          id="word-upload"
        />
        <Button variant="outline" asChild>
          <label htmlFor="word-upload" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Importer depuis Word
          </label>
        </Button>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Aperçu de l'importation</DialogTitle>
          </DialogHeader>
          
          {errors.length > 0 && (
            <ImportValidation errors={errors} />
          )}
          
          <ImportPreview 
            users={parsedUsers} 
            onImport={handleImport}
            hasErrors={errors.length > 0}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
