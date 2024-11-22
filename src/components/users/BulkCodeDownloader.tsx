import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";
import { UserData } from "@/types/user";
import QRCode from "react-qr-code";
import ReactBarcode from "react-barcode";
import { generateUniqueQRCode, generateUniqueBarcode } from "@/utils/codeGenerators";
import { generateImage, downloadZipFile } from "@/utils/downloadHelpers";
import { useCallback } from "react";

interface BulkCodeDownloaderProps {
  users: UserData[];
}

export const BulkCodeDownloader = ({ users }: BulkCodeDownloaderProps) => {
  const handleBulkDownload = useCallback(async () => {
    const toastId = toast.loading("Génération des codes en cours...");
    const zip = new JSZip();
    const tempContainers: HTMLElement[] = [];
    
    try {
      // Process users in batches to avoid memory issues
      const BATCH_SIZE = 5;
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE);
        
        for (const user of batch) {
          // Create containers
          const qrContainer = document.createElement('div');
          const barcodeContainer = document.createElement('div');
          
          [qrContainer, barcodeContainer].forEach(container => {
            container.style.cssText = 'position: absolute; left: -9999px;';
            document.body.appendChild(container);
            tempContainers.push(container);
          });

          // Generate images
          const [qrImage, barcodeImage] = await Promise.all([
            generateImage(qrContainer, { 
              width: 256,
              height: 256,
              backgroundColor: '#ffffff'
            }),
            generateImage(barcodeContainer, {
              width: 300,
              height: 100,
              backgroundColor: '#ffffff'
            })
          ]);

          // Add to ZIP
          zip.file(`${user.name}-qr.png`, qrImage.split('base64,')[1], { base64: true });
          zip.file(`${user.name}-barcode.png`, barcodeImage.split('base64,')[1], { base64: true });
        }

        // Clean up batch containers
        tempContainers.forEach(container => container.remove());
        tempContainers.length = 0;
      }

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      await downloadZipFile(content, "tous-les-codes.zip");

      toast.success("Tous les codes ont été téléchargés avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur lors du téléchargement en masse:", error);
      toast.error("Erreur lors du téléchargement des codes", { id: toastId });
    } finally {
      // Final cleanup
      tempContainers.forEach(container => container.remove());
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