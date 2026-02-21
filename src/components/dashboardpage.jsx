import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = ({ user }) => {
  const isFirstTime = !user?.lastLogin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isFirstTime ? `Welcome, ${user?.firstName}! 🎉` : `Welcome back, ${user?.firstName}! 👋`}
        </h1>
        <p className="text-lg text-gray-600">
          {isFirstTime
            ? "You're all set! Start exploring resources and connecting with your peers."
            : "Continue learning and achieving your academic goals."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-red-900 mb-2">0</p>
              <p className="text-sm text-gray-600">Courses Enrolled</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-red-900 mb-2">0</p>
              <p className="text-sm text-gray-600">Study Hours</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-red-900 mb-2">0</p>
              <p className="text-sm text-gray-600">Resources</p>
            </div>
          </div>

          {/* Empty State for Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-400">
              <p className="text-4xl mb-3">📚</p>
              <p className="font-semibold">No courses yet</p>
              <p className="text-sm mt-1">Browse resources to get started</p>
            </div>
          </div>

          {/* Empty State for Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-400">
              <p className="text-4xl mb-3">🕐</p>
              <p className="font-semibold">No recent activity</p>
              <p className="text-sm mt-1">Your activity will appear here</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {user?.firstName?.charAt(0)?.toUpperCase()}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <span className="inline-block mt-3 px-3 py-1 bg-red-100 text-red-900 text-xs font-semibold rounded-full capitalize">
                {user?.role || 'Student'}
              </span>
            </div>
            <button className="w-full py-2 border-2 border-red-900 text-red-900 font-semibold rounded hover:bg-red-50 transition">
              Edit Profile
            </button>
          </div>

          {/* Empty Saved Materials */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Materials</h3>
            <div className="text-center text-gray-400 py-4">
              <p className="text-3xl mb-2">📌</p>
              <p className="text-sm">No saved materials yet</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/resources"
                className="block w-full px-4 py-2 bg-red-50 text-red-900 rounded font-semibold text-center hover:bg-red-100 transition text-sm"
              >
                Browse Resources
              </Link>
              <Link
                to="/community"
                className="block w-full px-4 py-2 bg-red-50 text-red-900 rounded font-semibold text-center hover:bg-red-100 transition text-sm"
              >
                Join Forum
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="block w-full px-4 py-2 bg-red-900 text-white rounded font-semibold text-center hover:bg-red-800 transition text-sm"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;