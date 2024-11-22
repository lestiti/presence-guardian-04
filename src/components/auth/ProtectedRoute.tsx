import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccessCodeDialog } from "./AccessCodeDialog";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [showDialog, setShowDialog] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleClose = () => {
    setShowDialog(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {!showDialog && children}
      <AccessCodeDialog
        isOpen={showDialog}
        onClose={handleClose}
        redirectPath={location.pathname}
      />
    </>
  );
};