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

  return (
    <>
      {showDialog ? null : children}
      <AccessCodeDialog
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          navigate("/");
        }}
        redirectPath={location.pathname}
      />
    </>
  );
};