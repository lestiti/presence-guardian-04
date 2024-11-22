import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const Error = ({ message = "Une erreur est survenue", onRetry }: ErrorProps) => (
  <Alert variant="destructive">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Erreur</AlertTitle>
    <AlertDescription className="flex items-center gap-4">
      {message}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Réessayer
        </Button>
      )}
    </AlertDescription>
  </Alert>
);