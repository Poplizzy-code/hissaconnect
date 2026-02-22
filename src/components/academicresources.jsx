import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AcademicResourcesPage = () => {
  const [step, setStep] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const levels = ['100', '200', '300', '400'];

  const handleLevelClick = async (level) => {
    setSelectedLevel(level);
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_URL}/api/resources/academic/${level}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setResources(response.data.data || []);
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSelectedLevel(null);
    setResources([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header with Back to Home */}
      <div className="mb-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-red-900 hover:text-red-800 font-semibold mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Home</span>
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Academic Resources</h1>
        <p className="text-lg text-gray-600">
          Access curated lecture notes, study materials, and past questions organized by academic level.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Step 1: Choose Level */}
      {step === 1 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Select Your Academic Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => handleLevelClick(level)}
                className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg border-2 border-transparent hover:border-red-900 transition text-center"
              >
                <p className="text-5xl font-bold text-red-900 mb-2">{level}</p>
                <p className="text-gray-600 font-semibold">Level</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: View Resources */}
      {step === 2 && (
        <div>
          <button
            onClick={handleBack}
            className="mb-8 flex items-center space-x-2 text-red-900 hover:text-red-800 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Levels</span>
          </button>

          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Level {selectedLevel} Resources
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading resources...</p>
            </div>
          ) : resources.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-600 text-lg">No resources available for this level yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div key={resource._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">
                      {resource.fileType === 'pdf' && '📄'}
                      {resource.fileType === 'image' && '🖼️'}
                      {resource.fileType === 'document' && '📋'}
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-900 text-xs font-semibold rounded-full capitalize">
                      {resource.section}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span>📅 {new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-2 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition text-center block"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AcademicResourcesPage;