import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    level: '100',
    section: 'academic',
    file: null,
    fileType: 'pdf',
  });
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'admin' },
  ]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setUploadData(prev => ({
      ...prev,
      file: e.target.files[0]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('level', uploadData.level);
    formData.append('section', uploadData.section);
    formData.append('file', uploadData.file);
    formData.append('fileType', uploadData.fileType);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/upload-resource', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess('Resource uploaded successfully!');
        setUploadData({
          title: '',
          description: '',
          level: '100',
          section: 'academic',
          file: null,
          fileType: 'pdf',
        });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/admin/make-admin/${userId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('User promoted to admin!');
        setUsers(users.map(u => 
          u.id === userId ? { ...u, role: 'admin' } : u
        ));
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to make admin');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-6 border-b border-gray-300 mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'overview'
              ? 'text-red-900 border-b-2 border-red-900'
              : 'text-gray-600 hover:text-red-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'upload'
              ? 'text-red-900 border-b-2 border-red-900'
              : 'text-gray-600 hover:text-red-900'
          }`}
        >
          Upload Resources
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-semibold transition-colors ${
            activeTab === 'users'
              ? 'text-red-900 border-b-2 border-red-900'
              : 'text-gray-600 hover:text-red-900'
          }`}
        >
          Manage Users
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">Total Users</p>
            <p className="text-4xl font-bold text-red-900 mt-2">254</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">Resources Uploaded</p>
            <p className="text-4xl font-bold text-red-900 mt-2">48</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">Active Discussions</p>
            <p className="text-4xl font-bold text-red-900 mt-2">156</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">Admin Users</p>
            <p className="text-4xl font-bold text-red-900 mt-2">3</p>
          </div>
        </div>
      )}

      {/* Upload Resources Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Resource</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Resource Title
              </label>
              <input
                type="text"
                name="title"
                value={uploadData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-200"
                placeholder="e.g., Ancient Civilizations Lecture Notes"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={uploadData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-200"
                rows="4"
                placeholder="Brief description of the resource"
              ></textarea>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Academic Level
              </label>
              <select
                name="level"
                value={uploadData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-200"
              >
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Section
              </label>
              <select
                name="section"
                value={uploadData.section}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-200"
              >
                <option value="academic">Academic Resources</option>
                <option value="research">Research & Opportunities</option>
              </select>
            </div>

            {/* File Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                File Type
              </label>
              <select
                name="fileType"
                value={uploadData.fileType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-200"
              >
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Upload File
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                required
              />
              {uploadData.file && (
                <p className="text-sm text-green-600 mt-2">✓ {uploadData.file.name}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition"
            >
              Upload Resource
            </button>
          </form>
        </div>
      )}

      {/* Manage Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{userItem.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{userItem.email}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userItem.role === 'admin'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {userItem.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(userItem.id)}
                          className="px-3 py-1 text-red-900 hover:bg-red-50 rounded font-semibold text-sm transition"
                        >
                          Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;