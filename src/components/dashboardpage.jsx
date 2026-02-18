import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = ({ user }) => {
  const [enrolledCourses] = useState([
    { id: 1, code: 'HIS101', name: 'Ancient History', progress: 75, level: '100' },
    { id: 2, code: 'INT201', name: 'International Relations', progress: 60, level: '200' },
    { id: 3, code: 'HIS301', name: 'Modern European History', progress: 45, level: '300' },
  ]);

  const [recentActivity] = useState([
    { type: 'note', title: 'New Lecture Note: French Revolution', time: '2 hours ago' },
    { type: 'question', title: 'Past Question added: Causes of WWI', time: '5 hours ago' },
    { type: 'discussion', title: 'You replied to: Cold War Discussion', time: '1 day ago' },
  ]);

  const [savedMaterials] = useState([
    { type: 'note', title: 'WWII Summary Notes' },
    { type: 'question', title: 'Decolonization Exam Questions' },
    { type: 'article', title: 'Cold War Timeline' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-lg text-gray-600">
          You're making great progress. Continue learning and achieving your academic goals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-red-900 mb-2">3</p>
              <p className="text-sm text-gray-600">Courses Enrolled</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-red-900 mb-2">24</p>
              <p className="text-sm text-gray-600">Study Hours</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-red-900 mb-2">12</p>
              <p className="text-sm text-gray-600">Resources</p>
            </div>
          </div>

          {/* Enrolled Courses */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              <Link to="/resources" className="text-red-900 hover:text-red-800 text-sm font-semibold">
                View All →
              </Link>
            </div>
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold">{course.code}</p>
                      <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-900 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4 hover:shadow-lg transition">
                  <div className="text-2xl">
                    {activity.type === 'note' && '📝'}
                    {activity.type === 'question' && '❓'}
                    {activity.type === 'discussion' && '💬'}
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{activity.title}</p>
                  </div>
                  <p className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</p>
                </div>
              ))}
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
              <span className="inline-block mt-3 px-3 py-1 bg-red-100 text-red-900 text-xs font-semibold rounded-full">
                {user?.role || 'Student'}
              </span>
            </div>
            <button className="w-full py-2 border-2 border-red-900 text-red-900 font-semibold rounded hover:bg-red-50 transition">
              Edit Profile
            </button>
          </div>

          {/* Saved Materials */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Materials</h3>
            <div className="space-y-3">
              {savedMaterials.map((material, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                  <span className="text-xl">
                    {material.type === 'note' && '📄'}
                    {material.type === 'question' && '❓'}
                    {material.type === 'article' && '📑'}
                  </span>
                  <p className="text-sm text-gray-700 flex-grow truncate">{material.title}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 border-2 border-red-900 text-red-900 font-semibold rounded hover:bg-red-50 transition text-sm">
              View All
            </button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;