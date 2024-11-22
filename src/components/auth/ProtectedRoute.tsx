import { ReactNode, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AccessCodeDialog } from "./AccessCodeDialog";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem("hasAccess");
    if (!hasAccess) {
      setShowDialog(true);
    }
  }, []);

  return (
    <>
      {children}
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