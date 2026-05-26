import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [uploadData, setUploadData] = useState({
    title: '', description: '', level: '100', section: 'academic', file: null, fileType: 'pdf',
  });
  const [researchData, setResearchData] = useState({
    title: '', description: '', category: 'scholarships', link: '',
  });
  const [newsData, setNewsData] = useState({
    title: '', content: '', category: 'general', youtubeUrl: '',
  });
  const [newsImages, setNewsImages] = useState([]);
  const [newsVideos, setNewsVideos] = useState([]);
  const [newsFiles, setNewsFiles] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalResources: 0, adminUsers: 0 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => { fetchUsers(); fetchNews(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const allUsers = response.data.data;
        setUsers(allUsers);
        setStats({
          totalUsers: allUsers.length,
          adminUsers: allUsers.filter(u => u.role === 'admin').length,
          totalResources: 0,
        });
      }
    } catch (err) {
      setError('Failed to fetch users');
    }
  };

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/news`);
      if (res.data.success) setNewsList(res.data.data);
    } catch {}
  };

  const handleNewsChange = (e) => {
    const { name, value } = e.target;
    setNewsData(prev => ({ ...prev, [name]: value }));
  };

  const handlePublishNews = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', newsData.title);
    formData.append('content', newsData.content);
    formData.append('category', newsData.category);
    if (newsData.youtubeUrl.trim()) formData.append('youtubeUrls', newsData.youtubeUrl.trim());
    newsImages.forEach(f => formData.append('images', f));
    newsVideos.forEach(f => formData.append('videos', f));
    newsFiles.forEach(f => formData.append('files', f));
    try {
      const res = await axios.post(`${API_URL}/api/news`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setSuccess('News post published!');
        setNewsData({ title: '', content: '', category: 'general', youtubeUrl: '' });
        setNewsImages([]);
        setNewsVideos([]);
        setNewsFiles([]);
        fetchNews();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish news');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Delete this news post?')) return;
    try {
      await axios.delete(`${API_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewsList(prev => prev.filter(n => n._id !== id));
    } catch {
      setError('Failed to delete news');
    }
  };

  const handleResearchChange = (e) => {
    const { name, value } = e.target;
    setResearchData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddResearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/api/admin/research`, researchData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSuccess('Opportunity added successfully!');
        setResearchData({ title: '', description: '', category: 'scholarships', link: '' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add opportunity');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setUploadData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUploadData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.file) { setError('Please select a file'); return; }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('description', uploadData.description);
    formData.append('level', uploadData.level);
    formData.append('section', uploadData.section);
    formData.append('file', uploadData.file);
    formData.append('fileType', uploadData.fileType);
    try {
      const response = await axios.post(`${API_URL}/api/admin/upload-resource`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setSuccess('Resource uploaded successfully!');
        setUploadData({ title: '', description: '', level: '100', section: 'academic', file: null, fileType: 'pdf' });
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/make-admin/${userId}`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccess('User promoted to admin!');
        setUsers(users.map(u => u._id === userId ? { ...u, role: 'admin' } : u));
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to make admin');
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'news', label: 'News & Posts' },
    { key: 'upload', label: 'Upload Resources' },
    { key: 'research', label: 'Research & Opportunities' },
    { key: 'users', label: 'Manage Users' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome, {user?.firstName}!</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
          <button onClick={() => setError('')} className="ml-4 font-bold">×</button>
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-300 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === tab.key ? 'text-red-900 border-b-2 border-red-900' : 'text-gray-600 hover:text-red-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">Total Users</p>
            <p className="text-4xl font-bold text-red-900 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">Admin Users</p>
            <p className="text-4xl font-bold text-red-900 mt-2">{stats.adminUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">Resources Uploaded</p>
            <p className="text-4xl font-bold text-red-900 mt-2">{stats.totalResources}</p>
          </div>
        </div>
      )}

      {/* News Tab */}
      {activeTab === 'news' && (
        <div className="space-y-8">
          {/* Publish form */}
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Publish News Post</h2>
            <form onSubmit={handlePublishNews} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
                <input type="text" name="title" value={newsData.title} onChange={handleNewsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                  placeholder="e.g. Department Orientation 2025" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Content</label>
                <textarea name="content" value={newsData.content} onChange={handleNewsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                  rows="6" placeholder="Write the full news post here..." required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                <select name="category" value={newsData.category} onChange={handleNewsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900">
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="events">Events</option>
                  <option value="achievements">Achievements</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Photos</label>
                <p className="text-xs text-gray-500 mb-2">Upload one or more images (JPG, PNG, etc.)</p>
                <input type="file" multiple accept="image/*,image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                  onChange={(e) => setNewsImages(Array.from(e.target.files))}
                  className="w-full text-sm" />
                {newsImages.length > 0 && <p className="text-xs text-green-600 mt-1">✓ {newsImages.length} photo(s) selected</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Videos</label>
                <p className="text-xs text-gray-500 mb-2">Upload video files</p>
                <input type="file" multiple accept="video/*,video/mp4,video/webm,video/ogg,video/avi,video/mov,video/mkv"
                  onChange={(e) => setNewsVideos(Array.from(e.target.files))}
                  className="w-full text-sm" />
                {newsVideos.length > 0 && <p className="text-xs text-green-600 mt-1">✓ {newsVideos.length} video(s) selected</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">YouTube Link (optional)</label>
                <input type="url" name="youtubeUrl" value={newsData.youtubeUrl} onChange={handleNewsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                  placeholder="https://youtube.com/watch?v=..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">File Attachments</label>
                <p className="text-xs text-gray-500 mb-2">Attach PDFs or documents</p>
                <input type="file" multiple
                  onChange={(e) => setNewsFiles(Array.from(e.target.files))}
                  className="w-full text-sm" />
                {newsFiles.length > 0 && <p className="text-xs text-green-600 mt-1">✓ {newsFiles.length} file(s) selected</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-50">
                {loading ? 'Publishing...' : 'Publish News Post'}
              </button>
            </form>
          </div>

          {/* Existing news */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Published Posts ({newsList.length})</h2>
            {newsList.length === 0 ? (
              <p className="text-gray-500 text-sm">No news posts yet.</p>
            ) : (
              <div className="space-y-3">
                {newsList.map((post) => (
                  <div key={post._id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{post.category}</span>
                        <span className="text-xs text-gray-400">{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="font-semibold text-gray-900 truncate">{post.title}</p>
                      <p className="text-sm text-gray-500 truncate">{post.content.slice(0, 80)}...</p>
                    </div>
                    <button onClick={() => handleDeleteNews(post._id)}
                      className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-semibold transition flex-shrink-0">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Resource</h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Resource Title</label>
              <input type="text" name="title" value={uploadData.title} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                placeholder="e.g., Ancient Civilizations Lecture Notes" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea name="description" value={uploadData.description} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                rows="4" placeholder="Brief description of the resource"></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Academic Level</label>
              <select name="level" value={uploadData.level} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900">
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Section</label>
              <select name="section" value={uploadData.section} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900">
                <option value="academic">Academic Resources</option>
                <option value="research">Research & Opportunities</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">File Type</label>
              <select name="fileType" value={uploadData.fileType} onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900">
                <option value="pdf">PDF</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Upload File</label>
              <input type="file" onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
              {uploadData.file && <p className="text-sm text-green-600 mt-2">✓ {uploadData.file.name}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-50">
              {loading ? 'Uploading...' : 'Upload Resource'}
            </button>
          </form>
        </div>
      )}

      {/* Research & Opportunities Tab */}
      {activeTab === 'research' && (
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Research & Opportunity</h2>
          <p className="text-gray-500 text-sm mb-6">Add a link to an external article or opportunity page</p>
          <form onSubmit={handleAddResearch} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
              <input type="text" name="title" value={researchData.title} onChange={handleResearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                placeholder="e.g., Graduate Study Scholarship 2025" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea name="description" value={researchData.description} onChange={handleResearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                rows="3" placeholder="Brief description of the opportunity" required></textarea>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select name="category" value={researchData.category} onChange={handleResearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900">
                <option value="scholarships">Scholarships</option>
                <option value="conferences">Conferences</option>
                <option value="internships">Internships</option>
                <option value="research-grants">Research Grants</option>
                <option value="volunteering">Volunteering</option>
                <option value="careers">Careers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Link URL</label>
              <p className="text-xs text-gray-500 mb-2">Paste the full URL to the article or opportunity page</p>
              <input type="url" name="link" value={researchData.link} onChange={handleResearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900"
                placeholder="https://example.com/scholarship-details" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-50">
              {loading ? 'Adding...' : 'Add Opportunity'}
            </button>
          </form>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Matric No</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{userItem.firstName} {userItem.lastName}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{userItem.email}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{userItem.matricNo}</td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        userItem.role === 'admin' ? 'bg-red-100 text-red-900' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      {userItem.role !== 'admin' && (
                        <button onClick={() => handleMakeAdmin(userItem._id)}
                          className="px-3 py-1 text-red-900 hover:bg-red-50 rounded font-semibold text-sm transition">
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