import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AccessCodeDialog } from "./AccessCodeDialog";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [showDialog, setShowDialog] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <AccessCodeDialog
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onSuccess={() => {
            setIsAuthenticated(true);
            setShowDialog(false);
          }}
        />
        {!showDialog && <Navigate to="/" replace />}
      </>
    );
  }

  return <>{children}</>;
};