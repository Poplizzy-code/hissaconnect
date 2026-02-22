import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Navbar from "./components/navbar";
import Footer from "./components/footer";
import HomePage from "./components/homepage";
import LoginPage from "./components/loginpage";
import RegisterPage from "./components/registerpage";
import DashboardPage from "./components/dashboardpage";
import AdminDashboard from "./components/admindashboard";
import AcademicResourcesPage from "./components/academicresources";
import CommunityForumPage from "./components/communityforumpage";
import "./index.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (tokenData, userData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleStartLearning = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      setShowRegister(true);
    }
  };

  const handleExploreCourses = () => {
    if (isAuthenticated) {
      window.location.href = "/resources";
    } else {
      setShowLogin(true);
    }
  };

  const handleOpenCommunity = () => {
    if (isAuthenticated) {
      setShowCommunity(true);
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar
        isAuthenticated={isAuthenticated}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setShowLogin(true)}
        onRegisterClick={() => setShowRegister(true)}
      />

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <LoginPage onLogin={handleLogin} />
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={() => setShowRegister(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <RegisterPage onLogin={handleLogin} />
          </div>
        </div>
      )}

      {/* Community Modal */}
      {showCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="fixed inset-0 bg-white z-40">
            <button
              onClick={() => setShowCommunity(false)}
              className="absolute top-6 right-6 z-50 p-2 bg-red-900 text-white hover:bg-red-800 rounded-full transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <CommunityForumPage user={user} />
          </div>
        </div>
      )}

      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onStartLearning={handleStartLearning}
                onExploreCourses={handleExploreCourses}
                onOpenCommunity={handleOpenCommunity}
                isAuthenticated={isAuthenticated}
              />
            }
          />

          {isAuthenticated ? (
            <>
              {user?.role === "admin" && (
                <Route path="/admin-dashboard" element={<AdminDashboard user={user} />} />
              )}
              <Route path="/admin" element={<AdminDashboard user={user} />} />
              <Route path="/dashboard" element={<DashboardPage user={user} />} />
              <Route path="/resources" element={<AcademicResourcesPage />} />
              <Route path="/community" element={<CommunityForumPage user={user} />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/register" element={<RegisterPage onLogin={handleLogin} />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;