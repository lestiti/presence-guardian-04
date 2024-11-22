import { useState } from "react";
import { Menu, BarChart2, Users, Grid, QrCode, Settings, X } from "lucide-react";
import { Link } from "react-router-dom";
import { AccessCodeDialog } from "../access/AccessCodeDialog";
import { useAccess } from "@/hooks/useAccess";
import { Button } from "../ui/button";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAccessDialog, setShowAccessDialog] = useState(false);
  const { role, clearAccess } = useAccess();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAccessClick = () => {
    if (role === 'public') {
      setShowAccessDialog(true);
    } else {
      clearAccess();
    }
  };

  const getAvailableLinks = () => {
    const links = [
      {
        to: "/",
        icon: Grid,
        label: "Dashboard",
        roles: ['super_admin', 'admin', 'public'],
      },
      {
        to: "/users",
        icon: Users,
        label: "Utilisateurs",
        roles: ['super_admin'],
      },
      {
        to: "/synods",
        icon: Grid,
        label: "Synodes",
        roles: ['super_admin'],
      },
      {
        to: "/attendance",
        icon: QrCode,
        label: "Pointage",
        roles: ['super_admin', 'admin', 'public'],
      },
      {
        to: "/reports",
        icon: BarChart2,
        label: "Rapports",
        roles: ['super_admin', 'admin'],
      },
      {
        to: "/settings",
        icon: Settings,
        label: "Paramètres",
        roles: ['super_admin'],
      },
    ];

    return links.filter(link => link.roles.includes(role));
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/5 backdrop-blur-glass shadow-glass border border-white/20 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button 
              className="lg:hidden text-white p-2 rounded-lg transition-all duration-300 hover:bg-white/20 active:scale-95" 
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80 active:scale-95"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center backdrop-blur-sm bg-white/10">
                <span className="text-white font-bold">FC</span>
              </div>
              <span className="text-lg font-semibold text-white">FPVM Checking</span>
            </Link>
          </div>
          
          <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex absolute lg:relative top-16 lg:top-0 left-0 right-0 bg-white lg:bg-transparent shadow-soft lg:shadow-none p-4 lg:p-0 space-y-4 lg:space-y-0 lg:items-center lg:space-x-8 border border-gray-200 lg:border-0`}>
            {getAvailableLinks().map(({ to, icon: Icon, label }) => (
              <Link 
                key={to}
                to={to} 
                className="nav-link flex items-center space-x-2 text-gray-700 lg:text-white/80 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 lg:hover:bg-white/20 hover:text-primary lg:hover:text-white active:scale-95" 
                onClick={toggleMenu}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
            
            <Button
              variant="outline"
              onClick={handleAccessClick}
              className="w-full lg:w-auto text-white border-white/20 hover:bg-white/20"
            >
              {role === 'public' ? 'Accès administrateur' : 'Déconnexion'}
            </Button>
          </nav>
        </div>
      </div>

      <AccessCodeDialog
        open={showAccessDialog}
        onClose={() => setShowAccessDialog(false)}
      />
    </header>
  );
};