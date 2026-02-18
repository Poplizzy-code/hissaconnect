import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';

const RegisterPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    matricNo: '',
    currentLevel: '100',
    password: '',
    confirmPassword: '',
    saveDetails: false,
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.matricNo || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await registerUser(formData);

      if (response.success) {
        if (formData.saveDetails) {
          localStorage.setItem('savedUserDetails', JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            matricNo: formData.matricNo,
            currentLevel: formData.currentLevel,
          }));
        } else {
          localStorage.removeItem('savedUserDetails');
        }

        onLogin(response.token, response.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-900 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE (Hero Panel) */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-red-800 via-red-900 to-black p-10 text-white relative">
          <div className="text-2xl font-bold tracking-wide">HISSA Connect</div>

          <div>
            <h1 className="text-4xl font-extrabold leading-tight mb-4">
              Your Access.<br />
              Your Network.<br />
              Your Growth.
            </h1>
            <p className="text-red-200 max-w-sm">
              Join the digital hub built for History & International Studies students.
              Learn, connect, and grow together.
            </p>
          </div>

          <div className="text-sm text-red-300">© {new Date().getFullYear()} HISSA Connect</div>
        </div>

        {/* RIGHT SIDE (Form Panel) */}
        <div className="bg-white p-8 md:p-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-gray-500 mb-6">Enter your details to get started</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* First & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-900 focus:ring-2 focus:ring-red-200 outline-none"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-900 focus:ring-2 focus:ring-red-200 outline-none"
                required
              />
            </div>

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-900 focus:ring-2 focus:ring-red-200 outline-none"
              required
            />

            {/* Matric No */}
            <input
              type="text"
              name="matricNo"
              value={formData.matricNo}
              onChange={handleChange}
              placeholder="e.g., 2021/001"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-900 focus:ring-2 focus:ring-red-200 outline-none"
              required
            />

            {/* Level */}
            <select
              name="currentLevel"
              value={formData.currentLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-900 focus:ring-2 focus:ring-red-200 outline-none"
            >
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-900 focus:ring-2 focus:ring-red-200 outline-none"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-red-900 focus:ring-2 focus:ring-red-200 outline-none"
                required
              />
            </div>

            <p className="text-xs text-gray-500">Password must be at least 6 characters</p>

            {/* Checkboxes */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="saveDetails"
                checked={formData.saveDetails}
                onChange={handleChange}
                className="w-4 h-4 text-red-900 border-gray-300 rounded focus:ring-red-900"
              />
              <label className="ml-2 text-sm text-gray-600">
                Save my details for future sign ups
              </label>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 text-red-900 border-gray-300 rounded focus:ring-red-900 mt-1"
                required
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-red-900 font-semibold hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-red-900 font-semibold hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red-900 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;