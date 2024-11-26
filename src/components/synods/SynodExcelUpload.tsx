import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";

interface SynodData {
  name: string;
  description?: string;
  color?: string;
}

export const SynodExcelUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const processExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const synods: SynodData[] = jsonData.map((row: any) => ({
        name: row.name || row.Name || row.NOM || "",
        description: row.description || row.Description || row.DESCRIPTION || "",
        color: row.color || row.Color || row.COULEUR || "#10B981",
      }));

      return synods;
    } catch (error) {
      console.error("Error processing Excel file:", error);
      throw new Error("Erreur lors du traitement du fichier Excel");
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("synod_files")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Process Excel data
      const synods = await processExcelFile(file);

      // Insert synods into database
      for (const synod of synods) {
        if (!synod.name) continue;

        const { error: insertError } = await supabase
          .from("synods")
          .insert([synod]);

        if (insertError) {
          console.error("Error inserting synod:", insertError);
          toast.error(`Erreur lors de l'ajout du synode: ${synod.name}`);
        }
      }

      toast.success("Import des synodes réussi");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Erreur lors de l'import du fichier");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error("Veuillez sélectionner un fichier Excel (.xlsx ou .xls)");
      return;
    }

    await uploadFile(file);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
        id="excel-upload"
        disabled={isUploading}
      />
      <Button variant="outline" asChild disabled={isUploading}>
        <label htmlFor="excel-upload" className="cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Import en cours..." : "Importer depuis Excel"}
        </label>
      </Button>
    </div>
  );
};