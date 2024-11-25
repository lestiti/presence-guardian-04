import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Monitor, Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";

export const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: string) => {
    try {
      setTheme(newTheme as 'light' | 'dark' | 'system');
      toast.success(`Thème ${newTheme === 'light' ? 'clair' : newTheme === 'dark' ? 'sombre' : 'système'} activé`);
    } catch (error) {
      console.error("Error changing theme:", error);
      toast.error("Erreur lors du changement de thème");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Apparence</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Thème</Label>
            <p className="text-sm text-muted-foreground">
              Personnalisez l'apparence de l'application
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={theme === "light" ? "default" : "outline"}
              size="icon"
              onClick={() => handleThemeChange("light")}
              className="w-9 h-9"
            >
              <Sun className="h-4 w-4" />
              <span className="sr-only">Thème clair</span>
            </Button>
            <Button
              variant={theme === "dark" ? "default" : "outline"}
              size="icon"
              onClick={() => handleThemeChange("dark")}
              className="w-9 h-9"
            >
              <Moon className="h-4 w-4" />
              <span className="sr-only">Thème sombre</span>
            </Button>
            <Button
              variant={theme === "system" ? "default" : "outline"}
              size="icon"
              onClick={() => handleThemeChange("system")}
              className="w-9 h-9"
            >
              <Monitor className="h-4 w-4" />
              <span className="sr-only">Thème système</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};