import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Users, Building2, Settings, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[#4786FA] shadow-lg border-b border-[#D1DFFA]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Side - App Logo and Name */}
          <div className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              {/* App Logo */}
              <div className="w-8 h-8 bg-gradient-to-br from-[#FFFFFF] to-[#E3EAFE] rounded-lg flex items-center justify-center">
                <span className="text-[#4786FA] font-bold text-lg">C</span>
              </div>
              
              {/* App Name with Gradient */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FFFFFF] to-[#E3EAFE] bg-clip-text text-transparent">
                Crewzy
              </h1>
            </motion.div>
          </div>

          {/* Middle - Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white hover:text-[#E3EAFE] transition-colors duration-300"
            >
              <Link to="/admin-dashboard" className="flex items-center gap-2 font-medium">
                <Building2 className="w-4 h-4" />
                Dashboard
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white hover:text-[#E3EAFE] transition-colors duration-300"
            >
              <Link to="/admin-registration" className="flex items-center gap-2 font-medium">
                <Users className="w-4 h-4" />
                Organizations
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white hover:text-[#E3EAFE] transition-colors duration-300"
            >
              <Link to="/demo" className="flex items-center gap-2 font-medium">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-white hover:text-[#E3EAFE] transition-colors duration-300"
            >
              <Link to="#" className="flex items-center gap-2 font-medium">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </motion.div>
          </div>

          {/* Right Side - Login/Logout Button */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-white text-sm hidden md:block">
                  Welcome, {user?.name || 'Admin'}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-white text-[#4786FA] px-4 py-2 rounded-xl font-semibold hover:bg-[#F4F7FF] transition-all duration-300 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="bg-white text-[#4786FA] px-4 py-2 rounded-xl font-semibold hover:bg-[#F4F7FF] transition-all duration-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Login
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white hover:text-[#E3EAFE] transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link to="/admin-dashboard" className="text-white hover:text-[#E3EAFE] transition-colors duration-300 flex items-center gap-2 py-2">
              <Building2 className="w-4 h-4" />
              Dashboard
            </Link>
            <Link to="/admin-registration" className="text-white hover:text-[#E3EAFE] transition-colors duration-300 flex items-center gap-2 py-2">
              <Users className="w-4 h-4" />
              Organizations
            </Link>
            <Link to="/demo" className="text-white hover:text-[#E3EAFE] transition-colors duration-300 flex items-center gap-2 py-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
            <Link to="#" className="text-white hover:text-[#E3EAFE] transition-colors duration-300 flex items-center gap-2 py-2">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
