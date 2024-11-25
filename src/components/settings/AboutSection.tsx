import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const AboutSection = () => {
  const handleCopyVersion = () => {
    navigator.clipboard.writeText("1.0.0").then(() => {
      toast.success("Version copiée dans le presse-papier");
    }).catch(() => {
      toast.error("Erreur lors de la copie");
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">À propos</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Version</p>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={handleCopyVersion}
          >
            1.0.0
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 FPVM Checking
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => window.open("https://fpvm.org", "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Site web
          </Button>
        </div>

        <p className="text-xs text-muted-foreground border-t pt-4 mt-4">
          Tous droits réservés. FPVM Checking est une application développée pour faciliter la gestion des présences.
        </p>
      </div>
    </Card>
  );
};