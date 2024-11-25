import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { toast } from 'sonner';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error) {
    console.error('Error caught by error boundary:', error);
    toast.error("Une erreur est survenue");
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
          <h2 className="text-2xl font-semibold">Oops, quelque chose s'est mal passé</h2>
          <p className="text-muted-foreground max-w-md">
            Une erreur inattendue s'est produite. Nos équipes ont été notifiées.
          </p>
          <Button onClick={this.handleReset} variant="outline">
            Recharger la page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}