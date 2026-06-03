import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

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

const NEWS_CATEGORY_COLORS = {
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
        if (resourcesRes.data.success) setRecentResources(resourcesRes.data.data.slice(0, 3));
        if (researchRes.data.success) setResearchItems(researchRes.data.data.slice(0, 6));
        if (newsRes.data.success) setRecentNews(newsRes.data.data.slice(0, 3));
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

      {/* ── 1. HERO ── */}
      <section className="relative text-white py-28 overflow-hidden">
        {/* Background photo — lecture hall by Vitaly Gariev (Unsplash, free licence) */}
        <img
          src="https://images.unsplash.com/photo-1758270705799-12efda48d4f4?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Red brand overlay */}
        <div className="absolute inset-0 bg-red-900 bg-opacity-75" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-red-300 font-semibold tracking-widest uppercase text-sm mb-4">
              HISSA Connect — Dept. of History & International Studies
            </p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Academic Success Starts Here
            </h1>
            <p className="text-xl text-red-100 mb-10 max-w-2xl">
              Access verified resources, collaborate with peers, stay updated on department news,
              and achieve your academic goals — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onStartLearning}
                className="px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-red-50 transition text-center"
              >
                Start Learning For Free
              </button>
              <button
                onClick={onExploreCourses}
                className="px-8 py-3 border-2 border-white text-white font-bold rounded hover:bg-red-800 transition text-center"
              >
                Explore Resources
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. NEWS & ANNOUNCEMENTS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">News & Announcements</h2>
              <p className="text-gray-500 mt-1">Latest updates from the department</p>
            </div>
            <Link to="/news" className="text-red-900 font-semibold hover:underline whitespace-nowrap">
              View All →
            </Link>
          </div>
          {recentNews.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center text-gray-400">
              <p className="text-5xl mb-4">📰</p>
              <p className="text-lg font-semibold text-gray-600">No news yet</p>
              <p className="text-sm mt-1">Check back soon for department updates.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentNews.map((post) => (
                <Link
                  key={post._id}
                  to="/news"
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
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
                          <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
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
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${NEWS_CATEGORY_COLORS[post.category] || NEWS_CATEGORY_COLORS.general}`}>
                      {post.category}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base mt-2 mb-1 group-hover:text-red-900 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {new Date(post.publishedAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. ACADEMIC RESOURCES ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Academic Resources</h2>
              <p className="text-gray-500 mt-1">Lecture notes, past questions & study materials</p>
            </div>
            <Link to="/resources" className="text-red-900 font-semibold hover:underline whitespace-nowrap">
              View All →
            </Link>
          </div>
          {recentResources.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-lg font-semibold text-gray-600">No resources uploaded yet</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentResources.map((resource, index) => (
                <div key={resource._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                  <div className={`w-full h-44 bg-gradient-to-br ${getBgColor(index)} flex items-center justify-center text-5xl`}>
                    {getIcon(resource.fileType)}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-semibold text-red-900 bg-red-100 px-3 py-1 rounded-full uppercase">{resource.section}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-3 mb-1">{resource.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{resource.description}</p>
                    <a
                      href={getFileUrl(resource.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition block text-center text-sm"
                    >
                      Access Resource
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. RESEARCH & OPPORTUNITIES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Research & Opportunities</h2>
            <p className="text-gray-500 mt-1">Scholarships, conferences, internships and more</p>
          </div>
          {researchItems.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center text-gray-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold text-gray-600">No opportunities posted yet</p>
              <p className="text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {researchItems.map(item => {
                const borderColor = categoryBorderColors[item.category] || '#dc2626';
                const textColor = categoryTextColors[item.category] || '#dc2626';
                const label = categoryLabels[item.category] || item.category.toUpperCase();
                return (
                  <div key={item._id} style={{ borderLeftColor: borderColor }} className="border-l-4 pl-5">
                    <span style={{ color: textColor }} className="text-xs font-bold tracking-wide">{label}</span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">{item.title}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: textColor }}
                      className="text-sm font-semibold hover:underline"
                    >
                      Learn More →
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. ABOUT — AIM, VISION, MISSION ── */}
      <section className="py-20 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-red-300 font-semibold tracking-widest uppercase text-sm mb-3">Who We Are</p>
            <h2 className="text-4xl font-bold mb-4">The HISSA Impact Regime</h2>
            <p className="text-red-200 max-w-2xl mx-auto text-lg">
              Promoting academic excellence, student unity, leadership development, and meaningful
              engagement within the Department of History and International Studies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Aim */}
            <div className="bg-red-800 rounded-2xl p-8 border border-red-700 hover:border-white transition">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Aim</h3>
              <p className="text-red-200 leading-relaxed">
                To promote academic excellence, student unity, leadership development, and meaningful
                engagement within the department while creating lasting impact on students and the
                department as a whole.
              </p>
            </div>
            {/* Vision */}
            <div className="bg-red-800 rounded-2xl p-8 border border-red-700 hover:border-white transition">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-red-200 leading-relaxed">
                To build a united and intellectually vibrant student community driven by excellence,
                innovation, and impact.
              </p>
            </div>
            {/* Mission */}
            <div className="bg-red-800 rounded-2xl p-8 border border-red-700 hover:border-white transition">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-red-200 leading-relaxed">
                To serve, represent, and empower History and International Studies students through
                leadership, academic support, and impactful initiatives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. HOW IT WORKS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How HISSA Connect Works</h2>
            <p className="text-gray-500">Three simple steps to start your journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: 1, title: 'Sign Up & Join', desc: "Create your free account and become part of the HISSA Connect community." },
              { num: 2, title: 'Access Resources', desc: 'Browse lecture notes, past questions, and study materials organised by level and course.' },
              { num: 3, title: 'Excel & Connect', desc: 'Learn from peers, explore opportunities, and achieve your academic goals with confidence.' },
            ].map(step => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-red-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-5">{step.num}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FEATURES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need to Excel</h2>
            <p className="text-gray-500">Comprehensive tools to support your academic journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📖', title: 'Lecture Resources', desc: 'Organised lecture notes verified by instructors and supplementary materials for every course.' },
              { icon: '🔬', title: 'Research Opportunities', desc: 'Scholarships, conferences, internships, and research grants curated for History & Int\'l Studies students.' },
              { icon: '💬', title: 'Community Forum', desc: 'Connect with peers, ask questions, share insights, and learn from fellow students in real time.' },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition border border-gray-100">
                <div className="w-14 h-14 bg-red-900 text-white rounded-xl flex items-center justify-center text-2xl mb-5">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. COMMUNITY FORUM ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <p className="text-5xl mb-4">💬</p>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join the Community Forum</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Connect with fellow History & International Studies students, ask questions, and share knowledge.
            </p>
            <button
              onClick={onOpenCommunity}
              className="px-8 py-3 bg-red-900 text-white font-bold rounded hover:bg-red-800 transition"
            >
              Enter the Forum
            </button>
          </div>
        </div>
      </section>

      {/* ── 9. PRICING ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">HISSA Connect Plans</h2>
            <p className="text-gray-500">Choose the plan that fits your academic journey</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">₦0<span className="text-base text-gray-400 font-normal">/month</span></p>
              <ul className="space-y-3 mb-8 text-sm">
                {['Access all courses', 'Lecture notes & materials', 'Community forum'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span><span className="text-gray-700">{f}</span></li>
                ))}
                {['AI feedback', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-gray-300">✗</span><span className="text-gray-400">{f}</span></li>
                ))}
              </ul>
              <button onClick={onStartLearning} className="w-full py-3 border-2 border-gray-300 text-gray-700 font-bold rounded hover:bg-gray-100 transition text-sm">
                Get Started
              </button>
            </div>
            <div className="bg-red-900 text-white rounded-xl shadow-lg p-8 relative md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-red-900 px-4 py-1 rounded-full text-xs font-bold">MOST POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">₦1,000<span className="text-base font-normal">/month</span></p>
              <ul className="space-y-3 mb-8 text-sm">
                {['Everything in Free', 'AI-powered feedback', 'Advanced writing tools', 'Priority support', 'Premium resources'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="font-bold">✓</span><span>{f}</span></li>
                ))}
              </ul>
              <button onClick={onStartLearning} className="w-full py-3 bg-white text-red-900 font-bold rounded hover:bg-gray-100 transition text-sm">
                Start Free Trial
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Plus</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">₦3,000<span className="text-base text-gray-400 font-normal">/month</span></p>
              <ul className="space-y-3 mb-8 text-sm">
                {['Everything in Pro', '1-on-1 tutoring sessions', 'Exclusive webinars', 'Career guidance', 'CV building assistance'].map(f => (
                  <li key={f} className="flex items-center gap-2"><span className="text-green-600 font-bold">✓</span><span className="text-gray-700">{f}</span></li>
                ))}
              </ul>
              <button onClick={onStartLearning} className="w-full py-3 border-2 border-red-900 text-red-900 font-bold rounded hover:bg-red-50 transition text-sm">
                Upgrade to Plus
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. CTA ── */}
      <section className="py-16 bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Excel?</h2>
          <p className="text-xl mb-8 text-red-200">Join your fellow History & International Studies students on HISSA Connect</p>
          <button
            onClick={onStartLearning}
            className="px-8 py-3 bg-white text-red-900 font-bold rounded hover:bg-red-50 transition"
          >
            Get Started Today
          </button>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
