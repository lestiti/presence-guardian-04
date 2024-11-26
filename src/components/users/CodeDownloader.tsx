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
      // Create temporary elements for rendering
      const qrContainer = document.createElement('div');
      const barcodeContainer = document.createElement('div');
      
      qrContainer.style.cssText = 'background: white; padding: 20px; width: 300px; height: 300px;';
      barcodeContainer.style.cssText = 'background: white; padding: 20px; width: 300px; height: 150px;';
      
      document.body.appendChild(qrContainer);
      document.body.appendChild(barcodeContainer);

      const { qrImage, barcodeImage } = await generateCodeImages(userId, userName);

      // Cleanup temporary elements
      document.body.removeChild(qrContainer);
      document.body.removeChild(barcodeContainer);

      if (!qrImage || !barcodeImage) {
        throw new Error("Erreur lors de la génération des images");
      }

      zip.file(`${userName}-qr.png`, qrImage.split('base64,')[1], { base64: true });
      zip.file(`${userName}-barcode.png`, barcodeImage.split('base64,')[1], { base64: true });

      const content = await zip.generateAsync({ type: "blob" });
      await downloadZipFile(content, `${userName}-codes.zip`);

      toast.success("Codes téléchargés avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement des codes", { id: toastId });
    }
  }, [userId, userName]);

  return (
    <div className="space-y-8 py-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">QR Code</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CodeRenderer userId={userId} type="qr" />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Code-barres</h3>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <CodeRenderer userId={userId} type="barcode" />
        </div>
      </div>
      
      <Button 
        variant="outline" 
        size="lg" 
        onClick={handleDownload}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        Télécharger les codes
      </Button>
    </div>
  );
};