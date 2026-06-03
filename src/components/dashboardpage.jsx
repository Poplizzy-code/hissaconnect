import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const DashboardPage = ({ user, onUserUpdate }) => {
  const navigate = useNavigate();
  const isFirstTime = !user?.lastLogin;
  const [showEdit, setShowEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({
    bio: user?.bio || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
    currentLevel: user?.currentLevel || '100',
  });

  const openEdit = () => {
    setForm({
      bio: user?.bio || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
      currentLevel: user?.currentLevel || '100',
    });
    setPhotoPreview(null);
    setPhotoFile(null);
    setEditError('');
    setShowEdit(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError('');
    try {
      const formData = new FormData();
      formData.append('bio', form.bio);
      formData.append('phone', form.phone);
      formData.append('dateOfBirth', form.dateOfBirth);
      formData.append('currentLevel', form.currentLevel);
      if (photoFile) formData.append('profilePhoto', photoFile);

      const res = await api.put('/api/auth/profile', formData);
      if (res.data.success) {
        onUserUpdate(res.data.data);
        setShowEdit(false);
      }
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const avatarSrc = user?.profilePhoto;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-red-900 hover:text-red-700 text-sm font-semibold mb-6 transition">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {isFirstTime ? `Welcome, ${user?.firstName}!` : `Welcome back, ${user?.firstName}!`}
        </h1>
        <p className="text-lg text-gray-600">
          {isFirstTime
            ? "You're all set! Start exploring resources and connecting with your peers."
            : "Continue learning and achieving your academic goals."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
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

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-md p-10 text-center text-gray-400">
              <p className="text-4xl mb-3">🕐</p>
              <p className="font-semibold">No recent activity</p>
              <p className="text-sm mt-1">Your activity will appear here</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-4" />
              ) : (
                <div className="w-16 h-16 bg-red-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {user?.firstName?.charAt(0)?.toUpperCase()}
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
              {user?.bio && <p className="text-sm text-gray-500 mt-2 italic">"{user.bio}"</p>}
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 bg-red-100 text-red-900 text-xs font-semibold rounded-full capitalize">
                  {user?.role || 'Student'}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-900 text-xs font-semibold rounded-full">
                  Level {user?.currentLevel}
                </span>
              </div>
            </div>
            <button onClick={openEdit} className="w-full py-2 border-2 border-red-900 text-red-900 font-semibold rounded hover:bg-red-50 transition">
              Edit Profile
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Saved Materials</h3>
            <div className="text-center text-gray-400 py-4">
              <p className="text-3xl mb-2">📌</p>
              <p className="text-sm">No saved materials yet</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/resources" className="block w-full px-4 py-2 bg-red-50 text-red-900 rounded font-semibold text-center hover:bg-red-100 transition text-sm">
                Browse Resources
              </Link>
              <Link to="/community" className="block w-full px-4 py-2 bg-red-50 text-red-900 rounded font-semibold text-center hover:bg-red-100 transition text-sm">
                Join Forum
              </Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="block w-full px-4 py-2 bg-red-900 text-white rounded font-semibold text-center hover:bg-red-800 transition text-sm">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
              <button onClick={() => setShowEdit(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {editError && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded">{editError}</p>}

              {/* Photo */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {photoPreview || user?.profilePhoto ? (
                    <img src={photoPreview || user.profilePhoto} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-red-900 text-white rounded-full flex items-center justify-center text-3xl font-bold">
                      {user?.firstName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-7 h-7 bg-red-900 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-800 transition">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Tap the camera icon to change photo</p>
              </div>

              {/* Read-only info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">First Name</label>
                  <input value={user?.firstName || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Last Name</label>
                  <input value={user?.lastName || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Matric Number</label>
                <input value={user?.matricNo || ''} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm" />
              </div>

              {/* Editable fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Academic Level</label>
                <select
                  value={form.currentLevel}
                  onChange={(e) => setForm(p => ({ ...p, currentLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm"
                >
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+234 800 000 0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth <span className="text-gray-400 font-normal">(optional)</span></label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm(p => ({ ...p, dateOfBirth: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">About / Bio <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell your classmates a little about yourself..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm resize-none"
                />
                <p className="text-xs text-gray-400 text-right mt-0.5">{form.bio.length}/500</p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
