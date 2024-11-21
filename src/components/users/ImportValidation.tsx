import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ImportValidationProps {
  errors: string[];
}

export const ImportValidation = ({ errors }: ImportValidationProps) => {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erreurs détectées</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4 mt-2 space-y-1">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};