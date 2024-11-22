import { Card } from "@/components/ui/card";

export const AboutSection = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">À propos</h2>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Version: 1.0.0
        </p>
        <p className="text-sm text-muted-foreground">
          © 2024 FPVM Checking. Tous droits réservés.
        </p>
      </div>
    </Card>
  );
};