import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { toast } from "sonner";

interface CodeDownloaderProps {
  userId: string;
  userName: string;
}

export const CodeDownloader = ({ userId, userName }: CodeDownloaderProps) => {
  const handleDownload = async () => {
    try {
      // Créer un nouveau ZIP
      const zip = new JSZip();

      // Capturer le QR code
      const qrElement = document.getElementById(`qr-${userId}`);
      const barcodeElement = document.getElementById(`barcode-${userId}`);

      if (!qrElement || !barcodeElement) {
        throw new Error("Codes not found");
      }

      // Convertir en PNG haute qualité
      const qrPng = await toPng(qrElement, { 
        quality: 1.0,
        width: 3840,
        height: 3840,
        pixelRatio: 4
      });
      const barcodePng = await toPng(barcodeElement, {
        quality: 1.0,
        width: 3840,
        height: 1080,
        pixelRatio: 4
      });

      // Ajouter au ZIP
      zip.file(`${userName}-qr.png`, qrPng.split('base64,')[1], {base64: true});
      zip.file(`${userName}-barcode.png`, barcodePng.split('base64,')[1], {base64: true});

      // Générer et télécharger le ZIP
      const content = await zip.generateAsync({type: "blob"});
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}-codes.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Codes téléchargés avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement des codes");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleDownload}
      className="mt-4"
    >
      <Download className="w-4 h-4 mr-2" />
      Télécharger les codes
    </Button>
  );
};