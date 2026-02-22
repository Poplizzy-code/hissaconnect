import React, { useState } from 'react';

const CommunityForumPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('direct');
  const [messageInput, setMessageInput] = useState('');

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Community</h1>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('direct')}
              className={`flex-1 px-4 py-3 font-semibold text-center transition-colors ${
                activeTab === 'direct'
                  ? 'text-red-900 border-b-2 border-red-900'
                  : 'text-gray-600 hover:text-red-900'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 px-4 py-3 font-semibold text-center transition-colors ${
                activeTab === 'groups'
                  ? 'text-red-900 border-b-2 border-red-900'
                  : 'text-gray-600 hover:text-red-900'
              }`}
            >
              Groups
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-900"
            />
          </div>

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center p-6 text-center text-gray-400">
            <div>
              <p className="text-4xl mb-3">{activeTab === 'direct' ? '💬' : '👥'}</p>
              <p className="font-semibold">No {activeTab === 'direct' ? 'messages' : 'groups'} yet</p>
              <p className="text-sm mt-1">
                {activeTab === 'direct'
                  ? 'Start a conversation with a classmate'
                  : 'Join or create a study group'}
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area - Empty State */}
        <div className="flex-1 bg-white flex flex-col items-center justify-center text-center text-gray-400 p-8">
          <p className="text-5xl mb-4">🏛️</p>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Community Coming Soon</h2>
          <p className="text-gray-500 max-w-sm">
            The messaging and group chat features are being set up. Check back soon to connect with your classmates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunityForumPage;