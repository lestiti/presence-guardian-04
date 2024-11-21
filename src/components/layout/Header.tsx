import { Menu, User, BarChart2, Users, Grid } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-soft z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden">
              <Menu className="w-6 h-6 text-secondary" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">FC</span>
              </div>
              <span className="text-lg font-semibold text-secondary">FPVM Checking</span>
            </Link>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="nav-link flex items-center space-x-2">
              <Grid className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link to="/users" className="nav-link flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Users</span>
            </Link>
            <Link to="/reports" className="nav-link flex items-center space-x-2">
              <BarChart2 className="w-4 h-4" />
              <span>Reports</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};