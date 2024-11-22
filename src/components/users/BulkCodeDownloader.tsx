import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";
import { UserData } from "@/types/user";
import { generateCodeImages, downloadZipFile } from "@/utils/downloadHelpers";
import { useCallback } from "react";

interface BulkCodeDownloaderProps {
  users: UserData[];
}

export const BulkCodeDownloader = ({ users }: BulkCodeDownloaderProps) => {
  const handleBulkDownload = useCallback(async () => {
    const toastId = toast.loading("Génération des codes en cours...");
    const zip = new JSZip();
    
    try {
      // Process users in batches to avoid memory issues
      const BATCH_SIZE = 5;
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        
        for (const user of batch) {
          const { qrImage, barcodeImage } = await generateCodeImages(user.id, user.name);
          
          // Add to ZIP
          zip.file(`${user.name}-qr.png`, qrImage.split('base64,')[1], { base64: true });
          zip.file(`${user.name}-barcode.png`, barcodeImage.split('base64,')[1], { base64: true });

          // Update progress
          toast.loading(`Traitement: ${i + 1}/${users.length} utilisateurs...`, { id: toastId });
        }
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      await downloadZipFile(content, "tous-les-codes.zip");

      toast.success("Tous les codes ont été téléchargés avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur lors du téléchargement en masse:", error);
      toast.error("Erreur lors du téléchargement des codes", { id: toastId });
    }
  }, [users]);

  return (
    <Button 
      variant="outline" 
      onClick={handleBulkDownload}
      className="ml-2"
    >
      <Download className="w-4 h-4 mr-2" />
      Télécharger tous les codes
    </Button>
  );
};