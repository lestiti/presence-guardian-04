import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface LanguageSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
}

export const LanguageSettings = ({ language, setLanguage }: LanguageSettingsProps) => {
  const handleLanguageChange = (value: string) => {
    try {
      setLanguage(value);
      toast.success(`Langue changée en ${value === 'fr' ? 'Français' : 'Malagasy'}`);
    } catch (error) {
      console.error("Error changing language:", error);
      toast.error("Erreur lors du changement de langue");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Languages className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Langue</h2>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Langue de l'application</Label>
          <p className="text-sm text-muted-foreground">
            Choisissez la langue de l'interface
          </p>
        </div>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Sélectionner" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="mg">Malagasy</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
};