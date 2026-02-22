import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const categoryColors = {
  scholarships: 'green',
  conferences: 'blue',
  internships: 'purple',
  'research-grants': 'pink',
  volunteering: 'yellow',
  careers: 'red',
};

const categoryLabels = {
  scholarships: 'SCHOLARSHIPS',
  conferences: 'CONFERENCES',
  internships: 'INTERNSHIPS',
  'research-grants': 'RESEARCH GRANTS',
  volunteering: 'VOLUNTEERING',
  careers: 'CAREERS',
};

const HomePage = ({ onStartLearning, onExploreCourses, onOpenCommunity, isAuthenticated }) => {
  const [recentResources, setRecentResources] = useState([]);
  const [researchItems, setResearchItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [resourcesRes, researchRes] = await Promise.all([
          axios.get(`${API_URL}/api/resources`, { headers }),
          axios.get(`${API_URL}/api/admin/research`),
        ]);

        if (resourcesRes.data.success) {
          setRecentResources(resourcesRes.data.data.slice(0, 3));
        }
        if (researchRes.data.success) {
          setResearchItems(researchRes.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const getBgColor = (index) => {
    const colors = ['from-amber-100 to-amber-200', 'from-blue-100 to-blue-200', 'from-purple-100 to-purple-200'];
    return colors[index % colors.length];
  };

  const getIcon = (fileType) => {
    if (fileType === 'pdf') return '📄';
    if (fileType === 'image') return '🖼️';
    return '📋';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Academic Success Starts Here
              </h1>
              <p className="text-xl text-red-100 mb-8">
                Join thousands of History & International Studies students excelling with HISSA Connect. Access verified resources, collaborate with peers, and achieve your academic goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={onStartLearning} className="px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-red-50 transition text-center">
                  Start Learning For Free
                </button>
                <button onClick={onExploreCourses} className="px-8 py-3 border-2 border-white text-white font-bold rounded hover:bg-red-800 transition text-center">
                  Explore Courses
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="w-96 h-96 bg-red-800 rounded-lg flex items-center justify-center text-6xl">📚</div>
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need to Excel */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-600">Comprehensive tools to support your academic journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📖', title: 'Lecture Resources', desc: 'Access organized lecture notes, verified by instructors, and supplementary materials for every course.' },
              { icon: '✍️', title: 'Writing Tools', desc: 'Essay templates, citation guides, and model answers to help you excel in your assignments and exams.' },
              { icon: '💬', title: 'Community Forum', desc: 'Connect with peers, ask questions, share insights, and learn from discussions with fellow students.' },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition">
                <div className="w-16 h-16 bg-red-900 text-white rounded-lg flex items-center justify-center text-3xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How HISSA Connect Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How HISSA Connect Works</h2>
            <p className="text-xl text-gray-600">Three simple steps to start your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Sign Up & Choose Courses', desc: "Create your free account and enroll in the courses you're taking this semester." },
              { num: 2, title: 'Access Resources & Tools', desc: 'Browse lecture notes, past questions, writing templates, and study materials for each course.' },
              { num: 3, title: 'Excel in Your Studies', desc: 'Learn from peers, ask questions in forums, and achieve your academic goals with confidence.' },
            ].map(step => (
              <div key={step.num} className="text-center">
                <div className="w-20 h-20 bg-red-900 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-6">{step.num}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Academic Resources</h2>
            <Link to="/resources" className="text-red-900 font-semibold hover:underline">View All Courses →</Link>
          </div>
          {recentResources.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg font-semibold">No resources uploaded yet</p>
              <p className="text-sm mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentResources.map((resource, index) => (
                <div key={resource._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  <div className={`w-full h-48 bg-gradient-to-br ${getBgColor(index)} flex items-center justify-center text-6xl`}>
                    {getIcon(resource.fileType)}
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-semibold text-red-900 bg-red-100 px-3 py-1 rounded uppercase">{resource.section}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
                    <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="w-full py-2 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition block text-center">
                      Access Resource
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Exam & Writing Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Exam & Writing Tools</h2>
          <p className="text-xl text-gray-600 mb-12">Master your craft with our comprehensive guides</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              {[
                { title: 'Essay Templates', desc: 'Structured templates for historical essays and international relations analysis.' },
                { title: 'Citation Guides', desc: 'Learn Chicago citation style with practical examples and common mistakes to avoid.' },
                { title: 'Model Answers', desc: 'Study high-quality sample answers and understand what makes a response excellent.' },
              ].map(item => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[
                { title: 'Analysis Frameworks', desc: 'Proven frameworks for analyzing historical events and international issues effectively.' },
                { title: 'Common Mistakes', desc: 'Learn from common pitfalls and how to avoid them in your exams and assignments.' },
                { title: 'Exam Strategies', desc: 'Time management and test-taking strategies from successful students and instructors.' },
              ].map(item => (
                <div key={item.title} className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-900 text-white rounded flex items-center justify-center flex-shrink-0 font-bold">✓</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Community Forum */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Community Forum</h2>
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-400">
            <p className="text-5xl mb-4">💬</p>
            <p className="text-lg font-semibold text-gray-700">Join the conversation</p>
            <p className="text-sm mt-2 mb-6">Connect with fellow History & International Studies students</p>
            <button onClick={onOpenCommunity} className="inline-block px-8 py-3 bg-red-900 text-white font-bold rounded hover:bg-red-800 transition cursor-pointer">
              Join the Community
            </button>
          </div>
        </div>
      </section>

      {/* Research & Opportunities — REAL DATA */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Research & Opportunities</h2>
          {researchItems.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-12 text-center text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold">No opportunities posted yet</p>
              <p className="text-sm mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {researchItems.map(item => {
                const color = categoryColors[item.category] || 'red';
                const label = categoryLabels[item.category] || item.category.toUpperCase();
                return (
                  <div key={item._id} className={`border-l-4 border-${color}-600 pl-6`}>
                    <span className={`text-sm font-bold text-${color}-600`}>{label}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className={`text-${color}-600 font-semibold hover:underline`}>
                      Learn More →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">HISSA Connect Pro</h2>
            <p className="text-xl text-gray-600">Unlock premium features to enhance your learning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">N0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="space-y-3 mb-8">
                {['Access all courses', 'Lecture notes & materials', 'Community forum'].map(f => (
                  <li key={f} className="flex items-center space-x-2"><span className="text-green-600">✓</span><span>{f}</span></li>
                ))}
                {['AI feedback', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center space-x-2"><span className="text-gray-400">✗</span><span className="text-gray-400">{f}</span></li>
                ))}
              </ul>
              <button onClick={onStartLearning} className="w-full py-3 border-2 border-gray-300 text-gray-900 font-bold rounded hover:bg-gray-50 transition">
                Get Started
              </button>
            </div>
            <div className="bg-red-900 text-white rounded-lg shadow-lg p-8 relative md:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-red-900 px-4 py-1 rounded-full text-sm font-bold">MOST POPULAR</div>
              <h3 className="text-2xl font-bold mb-6">Pro</h3>
              <p className="text-4xl font-bold mb-6">N1000<span className="text-lg">/month</span></p>
              <ul className="space-y-3 mb-8">
                {['Everything in Free', 'AI-powered feedback', 'Advanced writing tools', 'Priority support', 'Premium resources'].map(f => (
                  <li key={f} className="flex items-center space-x-2"><span>✓</span><span>{f}</span></li>
                ))}
              </ul>
              <button onClick={onStartLearning} className="w-full py-3 bg-white text-red-900 font-bold rounded hover:bg-gray-100 transition">
                Start Your Free Trial
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Plus</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">N3000<span className="text-lg text-gray-600">/month</span></p>
              <ul className="space-y-3 mb-8">
                {['Everything in Pro', '1-on-1 tutoring sessions', 'Exclusive webinars', 'Career guidance', 'CV building assistance'].map(f => (
                  <li key={f} className="flex items-center space-x-2"><span className="text-green-600">✓</span><span>{f}</span></li>
                ))}
              </ul>
              <button onClick={onStartLearning} className="w-full py-3 border-2 border-red-900 text-red-900 font-bold rounded hover:bg-red-50 transition">
                Upgrade to Plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Excel?</h2>
          <p className="text-xl mb-8 text-red-100">Join thousands of students succeeding with HISSA Connect</p>
          <button onClick={onStartLearning} className="inline-block px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-red-50 transition cursor-pointer">
            Start Your Free Trial Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;