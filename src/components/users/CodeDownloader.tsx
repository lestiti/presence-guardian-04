import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import JSZip from "jszip";
import { toast } from "sonner";
import { CodeRenderer } from "./CodeRenderer";
import { generateImage, downloadZipFile } from "@/utils/downloadHelpers";
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
      // Create temporary containers
      const qrContainer = document.createElement('div');
      const barcodeContainer = document.createElement('div');
      
      // Set up containers
      [qrContainer, barcodeContainer].forEach(container => {
        container.style.cssText = 'position: absolute; left: -9999px;';
        document.body.appendChild(container);
      });

      // Render codes
      const qrRoot = document.createElement('div');
      const barcodeRoot = document.createElement('div');
      qrContainer.appendChild(qrRoot);
      barcodeContainer.appendChild(barcodeRoot);

      // Generate images with proper error handling
      const [qrImage, barcodeImage] = await Promise.all([
        generateImage(qrContainer, { width: 256, height: 256 }),
        generateImage(barcodeContainer, { width: 300, height: 100 })
      ]);

      // Add to ZIP
      zip.file(`${userName}-qr.png`, qrImage.split('base64,')[1], { base64: true });
      zip.file(`${userName}-barcode.png`, barcodeImage.split('base64,')[1], { base64: true });

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: "blob" });
      await downloadZipFile(content, `${userName}-codes.zip`);

      toast.success("Codes téléchargés avec succès", { id: toastId });
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      toast.error("Erreur lors du téléchargement des codes", { id: toastId });
    } finally {
      // Cleanup
      document.querySelectorAll('div[style*="-9999px"]').forEach(el => el.remove());
    }
  }, [userName]);

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