import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";
import { CodeRenderer } from "./CodeRenderer";
import { generateCodeImages, downloadZipFile } from "@/utils/downloadHelpers";
import { useCallback } from "react";

interface CodeDownloaderProps {
  userId: string;
  userName: string;
}

export const CodeDownloader = ({ userId, userName }: CodeDownloaderProps) => {
  const handleDownload = useCallback(async () => {
    const toastId = toast.loading("Génération des codes en cours...");
    const zip = new JSZip();
    
    try {
      const { qrImage, barcodeImage } = await generateCodeImages(userId, userName);

      if (!qrImage || !barcodeImage) {
        throw new Error("Erreur lors de la génération des images");
      }

      // Ajouter au ZIP
      zip.file(`${userName}-qr.png`, qrImage.split('base64,')[1], { base64: true });
      zip.file(`${userName}-barcode.png`, barcodeImage.split('base64,')[1], { base64: true });

      // Générer et télécharger le ZIP
      const content = await zip.generateAsync({ type: "blob" });
      await downloadZipFile(content, `${userName}-codes.zip`);

      toast.success("Codes téléchargés avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement des codes", { id: toastId });
    }
  }, [userId, userName]);

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">QR Code</h3>
        <CodeRenderer userId={userId} type="qr" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Code-barres</h3>
        <CodeRenderer userId={userId} type="barcode" />
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDownload}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger les codes
      </Button>
    </div>
  );
};