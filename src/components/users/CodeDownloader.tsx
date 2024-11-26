import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { CodeRenderer } from "./CodeRenderer";
import { useCallback } from "react";
import JSZip from "jszip";

interface CodeDownloaderProps {
  userId: string;
  userName: string;
  synodId?: string;
}

export const CodeDownloader = ({ userId, userName, synodId }: CodeDownloaderProps) => {
  const handleDownload = useCallback(async () => {
    const toastId = toast.loading("Génération des codes en cours...");
    
    try {
      // Create a new zip file
      const zip = new JSZip();
      
      // Generate QR Code SVG
      const qrContainer = document.getElementById('qr-container');
      const qrSvg = qrContainer?.querySelector('svg');
      if (qrSvg) {
        const qrBlob = new Blob([qrSvg.outerHTML], { type: 'image/svg+xml' });
        zip.file(`${userName}-qr.svg`, qrBlob);
      }

      // Generate Barcode SVG
      const barcodeContainer = document.getElementById('barcode-container');
      const barcodeSvg = barcodeContainer?.querySelector('svg');
      if (barcodeSvg) {
        const barcodeBlob = new Blob([barcodeSvg.outerHTML], { type: 'image/svg+xml' });
        zip.file(`${userName}-barcode.svg`, barcodeBlob);
      }

      // Generate ZIP file
      const content = await zip.generateAsync({ type: "blob" });
      
      // Create download link
      const url = window.URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${userName}-codes.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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
        <div id="qr-container" className="bg-white p-6 rounded-lg shadow-sm border">
          <CodeRenderer userId={userId} type="qr" synodId={synodId} />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Code-barres</h3>
        <div id="barcode-container" className="bg-white p-6 rounded-lg shadow-sm border">
          <CodeRenderer userId={userId} type="barcode" synodId={synodId} />
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