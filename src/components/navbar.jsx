import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({
  isAuthenticated,
  user,
  onLogout,
  onLoginClick,
  onRegisterClick,
  onCommunityClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/20 backdrop-blur-xl border-b border-gray-200/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/hissalogo.jpeg" alt="HISSA Connect" className="w-8 h-8 rounded object-cover" />
            <span className="hidden sm:block font-bold text-lg text-gray-900">
              HISSA Connect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors">
              Home
            </Link>
            <Link
              to="/news"
              className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors">
              News
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/resources"
                  className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors">
                  Resources
                </Link>
                <button
                  onClick={onCommunityClick}
                  className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors">
                  Community
                </button>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.role === "admin" ? "/admin-dashboard" : "/dashboard"
                  }
                  className="text-gray-700 hover:text-red-900 font-medium">
                  {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-900 hover:bg-red-50 rounded font-medium transition-colors">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-gray-700 hover:text-red-900 font-medium">
                  Sign In
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-red-900 text-white rounded hover:bg-red-800 font-medium transition-colors">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-red-900">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-red-900 font-medium">
              Home
            </Link>
            <Link
              to="/news"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:text-red-900 font-medium">
              News
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/resources"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:text-red-900 font-medium">
                  Resources
                </Link>
                <button
                  onClick={() => { onCommunityClick(); setIsOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors">
                  Community
                </button>
              </>
            )}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={
                      user?.role === "admin" ? "/admin-dashboard" : "/dashboard"
                    }
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-red-900 font-medium">
                    {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:text-red-900 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onLoginClick();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-900 font-medium">
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onRegisterClick();
                      setIsOpen(false);
                    }}
                    className="block w-full px-4 py-2 bg-red-900 text-white rounded font-medium text-center">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
