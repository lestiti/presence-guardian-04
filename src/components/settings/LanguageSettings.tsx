import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface LanguageSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
}

export const LanguageSettings = ({ language, setLanguage }: LanguageSettingsProps) => {
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast.success("Langue modifiée");
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Langue</h2>
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