import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const AppearanceSettings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Apparence</h2>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Thème</Label>
          <p className="text-sm text-muted-foreground">
            Choisissez le thème de l'application
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="icon"
            onClick={() => toggleTheme()}
          >
            <Sun className="h-4 w-4" />
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="icon"
            onClick={() => toggleTheme()}
          >
            <Moon className="h-4 w-4" />
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            size="icon"
            onClick={() => toggleTheme()}
          >
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};