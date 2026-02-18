import React, { useState } from 'react';
import axios from 'axios';

const CommunityForumPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('direct');
  const [conversations, setConversations] = useState([
    { id: 1, name: 'John Doe', lastMessage: 'Thanks for the notes!', timestamp: '2 mins ago', unread: 2, messages: [
      { id: 1, sender: 'John Doe', content: 'Thanks for the notes!', timestamp: '2 mins ago' },
      { id: 2, sender: user?.firstName, content: 'You\'re welcome!', timestamp: '1 min ago' }
    ]},
    { id: 2, name: 'Jane Smith', lastMessage: 'See you at the study group', timestamp: '1 hour ago', unread: 0, messages: [
      { id: 1, sender: 'Jane Smith', content: 'See you at the study group', timestamp: '1 hour ago' }
    ]},
    { id: 3, name: 'Mike Johnson', lastMessage: 'Did you finish the assignment?', timestamp: '3 hours ago', unread: 1, messages: [
      { id: 1, sender: 'Mike Johnson', content: 'Did you finish the assignment?', timestamp: '3 hours ago' }
    ]},
  ]);
  
  const [groups, setGroups] = useState([
    { id: 1, name: 'HIS301 Study Group', members: 12, lastMessage: 'Who wants to meet tomorrow?', timestamp: '5 mins ago', icon: '📚', messages: [
      { id: 1, sender: 'Sarah', content: 'Who wants to meet tomorrow?', timestamp: '5 mins ago' }
    ]},
    { id: 2, name: 'History Majors', members: 45, lastMessage: 'New research opportunities posted', timestamp: '30 mins ago', icon: '🏛️', messages: [
      { id: 1, sender: 'Admin', content: 'New research opportunities posted', timestamp: '30 mins ago' }
    ]},
    { id: 3, name: 'Int\'l Relations Discussion', members: 28, lastMessage: 'Discussing the UN reform', timestamp: '1 hour ago', icon: '🌍', messages: [
      { id: 1, sender: 'John', content: 'Discussing the UN reform', timestamp: '1 hour ago' }
    ]},
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    if (activeTab === 'direct' && selectedConversation) {
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedConversation.id) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: Date.now(),
                sender: user.firstName,
                content: messageInput,
                timestamp: 'now'
              }
            ],
            lastMessage: messageInput,
            timestamp: 'now'
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
      setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id));
    } else if (activeTab === 'groups' && selectedGroup) {
      const updatedGroups = groups.map(grp => {
        if (grp.id === selectedGroup.id) {
          return {
            ...grp,
            messages: [
              ...grp.messages,
              {
                id: Date.now(),
                sender: user.firstName,
                content: messageInput,
                timestamp: 'now'
              }
            ],
            lastMessage: messageInput,
            timestamp: 'now'
          };
        }
        return grp;
      });
      setGroups(updatedGroups);
      setSelectedGroup(updatedGroups.find(g => g.id === selectedGroup.id));
    }

    setMessageInput('');
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      members: 1,
      lastMessage: '',
      timestamp: 'now',
      icon: '📚',
      messages: []
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName('');
    setShowNewGroup(false);
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('direct');
                setSelectedGroup(null);
              }}
              className={`flex-1 px-4 py-3 font-semibold text-center transition-colors ${
                activeTab === 'direct'
                  ? 'text-red-900 border-b-2 border-red-900'
                  : 'text-gray-600 hover:text-red-900'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => {
                setActiveTab('groups');
                setSelectedConversation(null);
              }}
              className={`flex-1 px-4 py-3 font-semibold text-center transition-colors ${
                activeTab === 'groups'
                  ? 'text-red-900 border-b-2 border-red-900'
                  : 'text-gray-600 hover:text-red-900'
              }`}
            >
              Groups
            </button>
          </div>

          {/* New Group Button */}
          {activeTab === 'groups' && (
            <div className="p-4 border-b border-gray-200">
              {!showNewGroup ? (
                <button
                  onClick={() => setShowNewGroup(true)}
                  className="w-full py-2 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition"
                >
                  + New Group
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group name"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-900"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleCreateGroup}
                      className="flex-1 py-1 bg-red-900 text-white font-semibold rounded hover:bg-red-800 transition"
                    >
                      Create
                    </button>
                    <button
                      onClick={() => {
                        setShowNewGroup(false);
                        setNewGroupName('');
                      }}
                      className="flex-1 py-1 bg-gray-300 text-gray-700 font-semibold rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search users and chats..."
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-900"
            />
          </div>

          {/* Conversations/Groups List */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'direct' ? (
              <div>
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedConversation?.id === conv.id ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{conv.name}</p>
                      <p className="text-xs text-gray-500">{conv.timestamp}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate flex-1">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="ml-2 w-5 h-5 bg-red-900 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {groups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`w-full px-4 py-3 text-left border-b border-gray-100 hover:bg-gray-50 transition ${
                      selectedGroup?.id === group.id ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{group.icon}</span>
                        <p className="font-semibold text-gray-900">{group.name}</p>
                      </div>
                      <p className="text-xs text-gray-500">{group.timestamp}</p>
                    </div>
                    <div className="text-sm text-gray-600 ml-6">{group.members} members</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white flex flex-col">
          {selectedConversation || selectedGroup ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedConversation?.name || selectedGroup?.name}
                  </h2>
                  {selectedGroup && (
                    <p className="text-sm text-gray-600">{selectedGroup.members} members</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {(selectedConversation?.messages || selectedGroup?.messages || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === user?.firstName ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === user?.firstName
                          ? 'bg-red-900 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      {activeTab === 'groups' && msg.sender !== user?.firstName && (
                        <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                      )}
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === user?.firstName ? 'text-red-100' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-end gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-red-900 focus:ring-2 focus:ring-red-200"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-2 bg-red-900 text-white font-semibold rounded-full hover:bg-red-800 transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600 text-lg">
                {activeTab === 'direct' ? 'Select a conversation to start chatting' : 'Select a group to start chatting'}
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar - People */}
        <div className="w-64 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <h3 className="font-bold text-gray-900 mb-4">PEOPLE</h3>
          <div className="space-y-2">
            {[
              { name: 'Michael Chen', online: true },
              { name: 'Emma Wilson', online: true },
              { name: 'James Rodriguez', online: true },
              { name: 'Olivia Martinez', online: false },
              { name: 'Daniel Kim', online: false },
              { name: 'Sophia Anderson', online: true },
              { name: 'Alex Thompson', online: true },
              { name: 'Isabella Garcia', online: false },
            ].map((person, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 hover:bg-white rounded cursor-pointer transition">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                    ['bg-red-900', 'bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600'][idx % 5]
                  }`}>
                    {person.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{person.name}</p>
                    <p className={`text-xs ${person.online ? 'text-green-600' : 'text-gray-500'}`}>
                      {person.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                {person.online && (
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityForumPage;