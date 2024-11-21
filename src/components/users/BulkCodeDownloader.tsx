import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { toast } from "sonner";
import { UserData } from "@/types/user";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "@/utils/codeGenerators";

interface BulkCodeDownloaderProps {
  users: UserData[];
}

export const BulkCodeDownloader = ({ users }: BulkCodeDownloaderProps) => {
  const handleBulkDownload = async () => {
    try {
      const zip = new JSZip();
      
      // Créer un conteneur temporaire pour les codes
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      document.body.appendChild(tempContainer);

      // Pour chaque utilisateur
      for (const user of users) {
        // Créer les éléments QR et code-barres
        const qrDiv = document.createElement('div');
        const barcodeDiv = document.createElement('div');
        
        // Rendre les codes
        const qrRoot = document.createElement('div');
        const barcodeRoot = document.createElement('div');
        qrDiv.appendChild(qrRoot);
        barcodeDiv.appendChild(barcodeRoot);
        
        // Ajouter au DOM temporaire
        tempContainer.appendChild(qrDiv);
        tempContainer.appendChild(barcodeDiv);

        // Rendre les composants React
        const renderQR = <QRCode value={generateUniqueQRCode(user.id)} size={128} />;
        const renderBarcode = <ReactBarcode value={generateUniqueBarcode(user.id)} height={50} />;

        // Convertir en images
        const qrPng = await toPng(qrDiv, { 
          quality: 1.0,
          width: 3840,
          height: 3840,
          pixelRatio: 4
        });
        const barcodePng = await toPng(barcodeDiv, {
          quality: 1.0,
          width: 3840,
          height: 1080,
          pixelRatio: 4
        });

        // Ajouter au ZIP
        zip.file(`${user.name}-qr.png`, qrPng.split('base64,')[1], {base64: true});
        zip.file(`${user.name}-barcode.png`, barcodePng.split('base64,')[1], {base64: true});

        // Nettoyer
        tempContainer.removeChild(qrDiv);
        tempContainer.removeChild(barcodeDiv);
      }

      // Générer et télécharger le ZIP
      const content = await zip.generateAsync({type: "blob"});
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "tous-les-codes.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Nettoyer le conteneur temporaire
      document.body.removeChild(tempContainer);

      toast.success("Tous les codes ont été téléchargés avec succès");
    } catch (error) {
      console.error("Erreur lors du téléchargement en masse:", error);
      toast.error("Erreur lors du téléchargement des codes");
    }
  };

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