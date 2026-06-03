import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

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

const categoryBorderColors = {
  scholarships: '#16a34a',
  conferences: '#2563eb',
  internships: '#9333ea',
  'research-grants': '#db2777',
  volunteering: '#ca8a04',
  careers: '#dc2626',
};

const categoryTextColors = {
  scholarships: '#16a34a',
  conferences: '#2563eb',
  internships: '#9333ea',
  'research-grants': '#db2777',
  volunteering: '#ca8a04',
  careers: '#dc2626',
};

const CATEGORY_COLORS = {
  general: 'bg-gray-100 text-gray-700',
  academic: 'bg-blue-100 text-blue-700',
  events: 'bg-purple-100 text-purple-700',
  achievements: 'bg-yellow-100 text-yellow-700',
};

const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? match[1] : null;
};

const HomePage = ({ onStartLearning, onExploreCourses, onOpenCommunity, isAuthenticated }) => {
  const [recentResources, setRecentResources] = useState([]);
  const [researchItems, setResearchItems] = useState([]);
  const [recentNews, setRecentNews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [resourcesRes, researchRes, newsRes] = await Promise.all([
          token
            ? api.get('/api/resources')
            : Promise.resolve({ data: { success: false, data: [] } }),
          api.get('/api/admin/research'),
          api.get('/api/news'),
        ]);

        if (resourcesRes.data.success) {
          setRecentResources(resourcesRes.data.data.slice(0, 3));
        }
        if (researchRes.data.success) {
          setResearchItems(researchRes.data.data.slice(0, 6));
        }
        if (newsRes.data.success) {
          setRecentNews(newsRes.data.data.slice(0, 3));
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

  const getFileUrl = (url) => {
    if (!url) return url;
    if (url.includes('/upload/')) return url.replace('/upload/', '/upload/fl_attachment/');
    return url;
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

      {/* Academic Resources — REAL DATA, MOBILE FIXED */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {recentResources.map((resource, index) => (
                <div key={resource._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                  <div className={`w-full h-48 bg-gradient-to-br ${getBgColor(index)} flex items-center justify-center text-6xl`}>
                    {getIcon(resource.fileType)}
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-semibold text-red-900 bg-red-100 px-3 py-1 rounded uppercase">{resource.section}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-4" style={{
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {resource.description}
                    </p>
                    <a
                      href={getFileUrl(resource.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {researchItems.map(item => {
                const borderColor = categoryBorderColors[item.category] || '#dc2626';
                const textColor = categoryTextColors[item.category] || '#dc2626';
                const label = categoryLabels[item.category] || item.category.toUpperCase();
                return (
                  <div key={item._id} style={{ borderLeftColor: borderColor }} className="border-l-4 pl-6">
                    <span style={{ color: textColor }} className="text-sm font-bold">{label}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: textColor }}
                      className="font-semibold hover:underline">
                      Learn More →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* News & Announcements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">News & Announcements</h2>
            <Link to="/news" className="text-red-900 font-semibold hover:underline">View All News →</Link>
          </div>
          {recentNews.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-400">
              <p className="text-5xl mb-4">📰</p>
              <p className="text-lg font-semibold">No news yet</p>
              <p className="text-sm mt-2">Check back soon for department updates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((post) => (
                <Link
                  key={post._id}
                  to="/news"
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  {post.images?.length > 0 ? (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={post.images[0].url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : post.videos?.length > 0 && post.videos[0].videoType === 'youtube' ? (
                    <div className="h-44 bg-gray-900 relative overflow-hidden">
                      <img
                        src={`https://img.youtube.com/vi/${getYouTubeId(post.videos[0].url)}/hqdefault.jpg`}
                        alt={post.title}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-44 bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                      <svg className="w-10 h-10 text-red-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-5">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general}`}>
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg mt-2 mb-1 group-hover:text-red-900 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(post.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
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