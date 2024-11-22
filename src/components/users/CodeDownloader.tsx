import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { toast } from "sonner";
import { CodeRenderer } from "./CodeRenderer";

interface CodeDownloaderProps {
  userId: string;
  userName: string;
}

export const CodeDownloader = ({ userId, userName }: CodeDownloaderProps) => {
  const generateImage = async (element: HTMLElement): Promise<string> => {
    try {
      return await toPng(element, {
        quality: 0.95,
        pixelRatio: 2
      });
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    const toastId = toast.loading("Génération des codes en cours...");

    try {
      // Créer des conteneurs temporaires
      const qrContainer = document.createElement('div');
      const barcodeContainer = document.createElement('div');
      
      // Ajouter les conteneurs au DOM mais les cacher
      qrContainer.style.position = 'absolute';
      qrContainer.style.left = '-9999px';
      barcodeContainer.style.position = 'absolute';
      barcodeContainer.style.left = '-9999px';
      
      document.body.appendChild(qrContainer);
      document.body.appendChild(barcodeContainer);

      // Rendre les codes
      const qrRoot = document.createElement('div');
      const barcodeRoot = document.createElement('div');
      qrContainer.appendChild(qrRoot);
      barcodeContainer.appendChild(barcodeRoot);

      // Générer les images une par une
      const qrImage = await generateImage(qrContainer);
      const barcodeImage = await generateImage(barcodeContainer);

      // Ajouter au ZIP
      zip.file(`${userName}-qr.png`, qrImage.split('base64,')[1], { base64: true });
      zip.file(`${userName}-barcode.png`, barcodeImage.split('base64,')[1], { base64: true });

      // Générer et télécharger le ZIP
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}-codes.zip`;
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      document.body.removeChild(link);
      document.body.removeChild(qrContainer);
      document.body.removeChild(barcodeContainer);
      window.URL.revokeObjectURL(url);

      toast.success("Codes téléchargés avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement des codes", { id: toastId });
    }
  };

  return (
    <>
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
    </>
  );
};