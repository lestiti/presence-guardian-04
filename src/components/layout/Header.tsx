import { useState } from "react";
import { Menu, User, BarChart2, Users, Grid, QrCode, Settings, X } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
            <Link 
              to="/" 
              className="nav-link flex items-center space-x-2 text-gray-700 lg:text-white/80 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 lg:hover:bg-white/20 hover:text-primary lg:hover:text-white active:scale-95" 
              onClick={toggleMenu}
            >
              <Grid className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/users" 
              className="nav-link flex items-center space-x-2 text-gray-700 lg:text-white/80 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 lg:hover:bg-white/20 hover:text-primary lg:hover:text-white active:scale-95" 
              onClick={toggleMenu}
            >
              <Users className="w-4 h-4" />
              <span>Utilisateurs</span>
            </Link>
            <Link 
              to="/synods" 
              className="nav-link flex items-center space-x-2 text-gray-700 lg:text-white/80 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 lg:hover:bg-white/20 hover:text-primary lg:hover:text-white active:scale-95" 
              onClick={toggleMenu}
            >
              <Grid className="w-4 h-4" />
              <span>Synodes</span>
            </Link>
            <Link 
              to="/attendance" 
              className="nav-link flex items-center space-x-2 text-gray-700 lg:text-white/80 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 lg:hover:bg-white/20 hover:text-primary lg:hover:text-white active:scale-95" 
              onClick={toggleMenu}
            >
              <QrCode className="w-4 h-4" />
              <span>Pointage</span>
            </Link>
            <Link 
              to="/reports" 
              className="nav-link flex items-center space-x-2 text-gray-700 lg:text-white/80 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 lg:hover:bg-white/20 hover:text-primary lg:hover:text-white active:scale-95" 
              onClick={toggleMenu}
            >
              <BarChart2 className="w-4 h-4" />
              <span>Rapports</span>
            </Link>
            <Link 
              to="/settings" 
              className="nav-link flex items-center space-x-2 text-gray-700 lg:text-white/80 p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 lg:hover:bg-white/20 hover:text-primary lg:hover:text-white active:scale-95" 
              onClick={toggleMenu}
            >
              <Settings className="w-4 h-4" />
              <span>Paramètres</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 transition-all duration-300 hover:bg-white/20 active:scale-95">
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};