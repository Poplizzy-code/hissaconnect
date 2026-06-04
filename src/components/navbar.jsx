import React, { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/");
    setIsOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md border-b border-gray-100"
          : "bg-white/20 backdrop-blur-xl border-b border-gray-200/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img
              src="/hissalogo.jpeg"
              alt="HISSA Connect"
              className="w-8 h-8 rounded object-cover"
              loading="eager"
            />
            <span className="hidden sm:block font-bold text-lg text-gray-900 group-hover:text-red-900 transition-colors">
              HISSA Connect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors text-sm"
            >
              Home
            </Link>
            <Link
              to="/news"
              className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors text-sm"
            >
              News
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/resources"
                  className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors text-sm"
                >
                  Resources
                </Link>
                <button
                  onClick={onCommunityClick}
                  className="px-4 py-2 text-gray-700 hover:text-red-900 font-medium transition-colors text-sm"
                >
                  Community
                </button>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                  className="text-gray-700 hover:text-red-900 font-medium text-sm transition-colors"
                >
                  {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-900 hover:bg-red-50 rounded-lg font-medium transition-colors text-sm border border-red-200 hover:border-red-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="text-gray-700 hover:text-red-900 font-medium text-sm transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-800 font-medium transition-all duration-200 text-sm shadow-sm hover:shadow-md hover:-translate-y-px"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-red-900 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 mt-1 pt-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-gray-700 hover:text-red-900 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
            >
              Home
            </Link>
            <Link
              to="/news"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2.5 text-gray-700 hover:text-red-900 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
            >
              News
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/resources"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 hover:text-red-900 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                >
                  Resources
                </Link>
                <button
                  onClick={() => { onCommunityClick(); setIsOpen(false); }}
                  className="block w-full text-left px-4 py-2.5 text-gray-700 hover:text-red-900 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                >
                  Community
                </button>
              </>
            )}
            <div className="border-t border-gray-100 pt-3 mt-2 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link
                    to={user?.role === "admin" ? "/admin-dashboard" : "/dashboard"}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2.5 text-red-900 font-semibold text-sm hover:bg-red-50 rounded-lg transition-colors"
                  >
                    {user?.role === "admin" ? "Admin Panel" : "Dashboard"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-gray-700 hover:text-red-900 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { onLoginClick(); setIsOpen(false); }}
                    className="block w-full text-left px-4 py-2.5 text-gray-700 hover:text-red-900 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { onRegisterClick(); setIsOpen(false); }}
                    className="block w-full px-4 py-2.5 bg-red-900 text-white rounded-lg font-semibold text-sm text-center hover:bg-red-800 transition-colors"
                  >
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
