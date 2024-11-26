import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { useSynodStore } from "@/stores/synodStore";
import { generateSynodTemplate } from "@/utils/excelTemplates";

interface SynodData {
  name: string;
  description?: string;
  color?: string;
}

export const SynodExcelUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { fetchSynods } = useSynodStore();

  const processExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (!jsonData || jsonData.length === 0) {
        throw new Error("Le fichier Excel est vide ou mal formaté");
      }

      console.log("Données Excel extraites:", jsonData);

      const synods: SynodData[] = jsonData.map((row: any) => ({
        name: row.name || row.Name || row.NOM || "",
        description: row.description || row.Description || row.DESCRIPTION || "",
        color: row.color || row.Color || row.COULEUR || "#10B981",
      })).filter(synod => synod.name.trim() !== "");

      return synods;
    } catch (error) {
      console.error("Error processing Excel file:", error);
      throw new Error("Erreur lors du traitement du fichier Excel");
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      const toastId = toast.loading("Import des synodes en cours...");

      // Process Excel data
      const synods = await processExcelFile(file);
      
      if (synods.length === 0) {
        toast.error("Aucun synode valide trouvé dans le fichier");
        return;
      }

      // Batch insert all synods at once
      const { error: insertError } = await supabase
        .from("synods")
        .insert(synods);

      if (insertError) {
        console.error("Error inserting synods:", insertError);
        toast.error("Erreur lors de l'import des synodes");
        return;
      }

      // Refresh the synods list
      await fetchSynods();

      toast.dismiss(toastId);
      toast.success(`Import réussi: ${synods.length} synodes importés`);
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
    e.target.value = ''; // Reset input after upload
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="hidden"
        id="excel-upload"
        disabled={isUploading}
      />
      <Button 
        variant="outline" 
        onClick={() => generateSynodTemplate()}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Télécharger le modèle
      </Button>
      <Button variant="outline" asChild disabled={isUploading}>
        <label htmlFor="excel-upload" className="cursor-pointer flex items-center">
          {isUploading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isUploading ? "Import en cours..." : "Importer depuis Excel"}
        </label>
      </Button>
    </div>
  );
};