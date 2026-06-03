import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CATEGORIES = [
  { key: 'all', label: 'All News' },
  { key: 'general', label: 'General' },
  { key: 'academic', label: 'Academic' },
  { key: 'events', label: 'Events' },
  { key: 'achievements', label: 'Achievements' },
];

const CATEGORY_COLORS = {
  general: 'bg-gray-100 text-gray-700',
  academic: 'bg-blue-100 text-blue-700',
  events: 'bg-purple-100 text-purple-700',
  achievements: 'bg-yellow-100 text-yellow-700',
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });

const getYouTubeId = (url) => {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return match ? match[1] : null;
};

const NewsPage = () => {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [activeCategory]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const params = activeCategory !== 'all' ? `?category=${activeCategory}` : '';
      const res = await api.get(`/api/news${params}`);
      if (res.data.success) setNews(res.data.data);
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const excerpt = (text, max = 120) =>
    text.length > max ? text.slice(0, max) + '...' : text;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="bg-red-900 text-white py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-red-200 hover:text-white text-sm font-semibold mb-4 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold mb-2">News & Announcements</h1>
          <p className="text-red-200 text-lg">Stay up to date with the Department of History & International Studies</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat.key
                  ? 'bg-red-900 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-900 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && news.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-5xl mb-4">📰</p>
            <p className="text-xl font-semibold text-gray-600">No news yet</p>
            <p className="text-sm mt-2">Check back soon for updates from the department.</p>
          </div>
        )}

        {/* News grid */}
        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((post) => (
              <article
                key={post._id}
                onClick={() => setSelectedPost(post)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                {/* Thumbnail */}
                {post.images?.length > 0 ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.images[0].url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : post.videos?.length > 0 && post.videos[0].videoType === 'youtube' ? (
                  <div className="h-48 bg-gray-900 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${getYouTubeId(post.videos[0].url)}/hqdefault.jpg`}
                      alt={post.title}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-300 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[post.category] || CATEGORY_COLORS.general}`}>
                      {post.category}
                    </span>
                    {post.files?.length > 0 && (
                      <span className="text-xs text-gray-400">📎 {post.files.length} file{post.files.length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                  <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-red-900 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{excerpt(post.content)}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>By {post.author?.firstName} {post.author?.lastName}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Full article modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center p-4 overflow-y-auto"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedPost(null); }}
        >
          <div className="bg-white rounded-2xl w-full max-w-3xl my-8 shadow-2xl">
            {/* Modal header */}
            <div className="sticky top-0 bg-white rounded-t-2xl flex items-center justify-between px-6 py-4 border-b border-gray-200 z-10">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${CATEGORY_COLORS[selectedPost.category] || CATEGORY_COLORS.general}`}>
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedPost.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                <span>By <strong>{selectedPost.author?.firstName} {selectedPost.author?.lastName}</strong></span>
                <span>·</span>
                <span>{formatDate(selectedPost.publishedAt)}</span>
              </div>

              {/* Content */}
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-8">
                {selectedPost.content}
              </div>

              {/* Images */}
              {selectedPost.images?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">Photos</h3>
                  <div className={`grid gap-2 ${selectedPost.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {selectedPost.images.map((img, i) => (
                      <div key={i} className="relative group cursor-pointer" onClick={() => setLightboxImage(img.url)}>
                        <img
                          src={img.url}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-56 object-cover rounded-lg hover:opacity-90 transition"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition flex items-center justify-center">
                          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {selectedPost.videos?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-bold text-gray-900 mb-3">Videos</h3>
                  <div className="space-y-4">
                    {selectedPost.videos.map((video, i) => {
                      if (video.videoType === 'youtube') {
                        const ytId = getYouTubeId(video.url);
                        return ytId ? (
                          <div key={i} className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${ytId}`}
                              title={`Video ${i + 1}`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : null;
                      }
                      return (
                        <video key={i} controls className="w-full rounded-lg">
                          <source src={video.url} />
                          Your browser does not support video.
                        </video>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* File attachments */}
              {selectedPost.files?.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-3">Attachments</h3>
                  <div className="space-y-2">
                    {selectedPost.files.map((file, i) => (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition group"
                      >
                        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-red-900 transition truncate">{file.name}</span>
                        <svg className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for images */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-[60] flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="Full size" className="max-w-full max-h-full rounded-lg shadow-2xl" />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
