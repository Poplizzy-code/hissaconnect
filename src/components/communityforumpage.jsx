import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = API_URL.replace('/api', '');

const getInitials = (firstName = '', lastName = '') =>
  `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();

const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const Avatar = ({ firstName, lastName, size = 'md', photo }) => {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  if (photo) {
    return <img src={photo} alt={firstName} className={`${sizes[size]} rounded-full object-cover`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-red-900 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {getInitials(firstName, lastName)}
    </div>
  );
};

const CommunityForumPage = ({ user }) => {
  const [socket, setSocket] = useState(null);
  const [activeTab, setActiveTab] = useState('messages');
  const [conversations, setConversations] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [typingInfo, setTypingInfo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [pendingRecipient, setPendingRecipient] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const token = localStorage.getItem('token');

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Connect socket
  useEffect(() => {
    if (!token) return;
    const s = io(SOCKET_URL, { auth: { token } });

    s.on('connect', () => {});
    s.on('new_message', ({ conversationId, message }) => {
      if (activeConv?._id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      // Refresh conversation list to update last message
      loadConversations();
      loadGroups();
    });
    s.on('typing', ({ userId, fullName, isTyping }) => {
      if (userId !== user?.id) {
        setTypingInfo(isTyping ? fullName : null);
        if (isTyping) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setTypingInfo(null), 3000);
        }
      }
    });
    s.on('user_online', ({ userId }) => {
      setOnlineUsers((prev) => new Set([...prev, userId]));
    });
    s.on('user_offline', ({ userId }) => {
      setOnlineUsers((prev) => { const n = new Set(prev); n.delete(userId); return n; });
    });
    s.on('conversation_ready', ({ conversationId }) => {
      // After sending first message to a new DM, join the room and reload
      s.emit('join_conversation', { conversationId });
      loadConversations();
    });
    s.on('new_conversation', () => {
      loadConversations();
    });

    setSocket(s);
    return () => s.disconnect();
  }, [token]);

  // Re-attach new_message when activeConv changes
  useEffect(() => {
    if (!socket) return;
    socket.off('new_message');
    socket.on('new_message', ({ conversationId, message }) => {
      if (activeConv?._id === conversationId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.find((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
      loadConversations();
      loadGroups();
    });
  }, [socket, activeConv]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setConversations(res.data.data);
    } catch {}
  }, [token]);

  const loadGroups = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/messages/groups`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setGroups(res.data.data);
    } catch {}
  }, [token]);

  useEffect(() => {
    loadConversations();
    loadGroups();
  }, [loadConversations, loadGroups]);

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setPendingRecipient(null);
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/messages/conversation/${conv._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setMessages(res.data.data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
    if (socket) socket.emit('join_conversation', { conversationId: conv._id });
  };

  const startDmWithUser = (targetUser) => {
    // Look for existing conversation
    const existing = conversations.find((c) =>
      c.participants.some((p) => p._id === targetUser._id)
    );
    if (existing) {
      openConversation(existing);
    } else {
      // Open a "pending" chat window - first message will create conversation
      setPendingRecipient(targetUser);
      setActiveConv({ _id: null, conversationType: 'direct', participants: [user, targetUser], tempUser: targetUser });
      setMessages([]);
    }
    setShowNewChat(false);
    setUserSearch('');
    setUserResults([]);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !socket) return;
    const content = messageInput.trim();
    setMessageInput('');

    if (pendingRecipient && !activeConv?._id) {
      // New DM — socket will create conversation and emit conversation_ready
      socket.emit('send_message', { content, recipientId: pendingRecipient._id });
      setPendingRecipient(null);
    } else if (activeConv?._id) {
      socket.emit('send_message', { conversationId: activeConv._id, content });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTyping = () => {
    if (!socket || !activeConv?._id) return;
    socket.emit('typing', { conversationId: activeConv._id, isTyping: true });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { conversationId: activeConv._id, isTyping: false });
    }, 1500);
  };

  const searchUsers = async (q) => {
    setUserSearch(q);
    if (!q.trim()) { setUserResults([]); return; }
    try {
      const res = await axios.get(`${API_URL}/messages/users?search=${q}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setUserResults(res.data.data);
    } catch {}
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const res = await axios.post(
        `${API_URL}/messages/groups`,
        { name: groupName, memberIds: selectedMembers.map((m) => m._id) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        loadGroups();
        setShowNewGroup(false);
        setGroupName('');
        setSelectedMembers([]);
        openConversation(res.data.data);
        setActiveTab('groups');
      }
    } catch {}
  };

  const getConvName = (conv) => {
    if (conv.conversationType === 'group') return conv.groupName;
    const other = conv.participants?.find((p) => p._id !== user?.id);
    return other ? `${other.firstName} ${other.lastName}` : 'Unknown';
  };

  const getConvOther = (conv) => {
    return conv.participants?.find((p) => p._id !== user?.id);
  };

  const getLastMessage = (conv) => {
    const msgs = conv.messages || [];
    if (!msgs.length) return 'No messages yet';
    return msgs[msgs.length - 1].content;
  };

  const getLastTime = (conv) => {
    const msgs = conv.messages || [];
    if (!msgs.length) return '';
    return formatTime(msgs[msgs.length - 1].timestamp);
  };

  const filteredList = activeTab === 'messages'
    ? conversations.filter((c) => getConvName(c).toLowerCase().includes(searchQuery.toLowerCase()))
    : groups.filter((g) => (g.groupName || '').toLowerCase().includes(searchQuery.toLowerCase()));

  const chatTitle = activeConv ? (
    activeConv.conversationType === 'group'
      ? activeConv.groupName
      : (activeConv.tempUser
          ? `${activeConv.tempUser.firstName} ${activeConv.tempUser.lastName}`
          : getConvName(activeConv))
  ) : '';

  const chatOther = activeConv?.conversationType === 'direct' ? getConvOther(activeConv) : null;
  const isOnline = chatOther && onlineUsers.has(chatOther._id);

  // Group messages by date
  const groupedMessages = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const d = formatDate(msg.timestamp);
    if (d !== lastDate) { groupedMessages.push({ type: 'date', label: d }); lastDate = d; }
    groupedMessages.push({ type: 'message', ...msg });
  });

  return (
    <div className="w-full h-full bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white flex flex-col border-r border-gray-200 flex-shrink-0">
        {/* Sidebar header */}
        <div className="bg-red-900 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size="md" />
            <span className="text-white font-bold text-lg">Community</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowNewChat(true); setActiveTab('messages'); }}
              title="New Message"
              className="p-1.5 text-white hover:bg-red-800 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => { setShowNewGroup(true); setActiveTab('groups'); }}
              title="New Group"
              className="p-1.5 text-white hover:bg-red-800 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-red-300"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'messages' ? 'text-red-900 border-b-2 border-red-900' : 'text-gray-500 hover:text-red-900'}`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'groups' ? 'text-red-900 border-b-2 border-red-900' : 'text-gray-500 hover:text-red-900'}`}
          >
            Groups
          </button>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filteredList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6 text-center">
              <p className="text-3xl mb-2">{activeTab === 'messages' ? '💬' : '👥'}</p>
              <p className="font-semibold text-sm">
                {activeTab === 'messages' ? 'No conversations yet' : 'No groups yet'}
              </p>
              <p className="text-xs mt-1">
                {activeTab === 'messages'
                  ? 'Tap + to start a chat'
                  : 'Tap the group icon to create one'}
              </p>
            </div>
          ) : (
            filteredList.map((conv) => {
              const isActive = activeConv?._id === conv._id;
              const other = getConvOther(conv);
              const online = other && onlineUsers.has(other._id);
              return (
                <button
                  key={conv._id}
                  onClick={() => openConversation(conv)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors text-left ${isActive ? 'bg-red-50' : ''}`}
                >
                  <div className="relative">
                    {conv.conversationType === 'group' ? (
                      <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                        {(conv.groupName || 'G')[0].toUpperCase()}
                      </div>
                    ) : (
                      <Avatar firstName={other?.firstName} lastName={other?.lastName} size="md" photo={other?.profilePhoto} />
                    )}
                    {online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-semibold text-gray-900 text-sm truncate">{getConvName(conv)}</p>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{getLastTime(conv)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{getLastMessage(conv)}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat area */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
            <div className="relative">
              {activeConv.conversationType === 'group' ? (
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  {(activeConv.groupName || 'G')[0].toUpperCase()}
                </div>
              ) : (
                <Avatar
                  firstName={chatOther?.firstName || activeConv.tempUser?.firstName}
                  lastName={chatOther?.lastName || activeConv.tempUser?.lastName}
                  size="md"
                />
              )}
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
            <div>
              <p className="font-bold text-gray-900">{chatTitle}</p>
              <p className="text-xs text-gray-500">
                {activeConv.conversationType === 'group'
                  ? `${activeConv.participants?.length || 0} members`
                  : isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: '#f0f0f0' }}>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-red-900 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-4xl mb-3">👋</p>
                <p className="font-semibold">Start the conversation!</p>
                <p className="text-sm text-gray-400 mt-1">Say hi to {chatTitle}</p>
              </div>
            ) : (
              groupedMessages.map((item, idx) => {
                if (item.type === 'date') {
                  return (
                    <div key={`date-${idx}`} className="flex justify-center my-3">
                      <span className="bg-white text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm">{item.label}</span>
                    </div>
                  );
                }
                const senderId = item.sender?._id || item.sender;
                const isOwn = senderId === user?.id || senderId?.toString() === user?.id;
                const senderName = item.sender?.firstName
                  ? `${item.sender.firstName} ${item.sender.lastName}`
                  : item.sender?.fullName || '';

                return (
                  <div key={item._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
                    <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'order-1' : 'order-2'}`}>
                      {!isOwn && activeConv.conversationType === 'group' && (
                        <p className="text-xs text-red-700 font-semibold mb-0.5 ml-1">{senderName}</p>
                      )}
                      <div className={`px-3 py-2 rounded-lg shadow-sm ${isOwn ? 'bg-red-900 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                        <p className="text-sm leading-relaxed">{item.content}</p>
                        <p className={`text-xs mt-0.5 text-right ${isOwn ? 'text-red-200' : 'text-gray-400'}`}>
                          {formatTime(item.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {typingInfo && (
              <div className="flex justify-start mb-1">
                <div className="bg-white px-3 py-2 rounded-lg shadow-sm rounded-bl-none">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">{typingInfo} is typing</span>
                    <span className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-end gap-3">
            <textarea
              value={messageInput}
              onChange={(e) => { setMessageInput(e.target.value); handleTyping(); }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message"
              rows={1}
              className="flex-1 resize-none px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-red-300 max-h-24"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!messageInput.trim()}
              className="w-10 h-10 bg-red-900 text-white rounded-full flex items-center justify-center hover:bg-red-800 transition disabled:opacity-40 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">HISSA Community</h2>
          <p className="text-gray-500 max-w-sm">
            Select a conversation to start chatting, or tap <span className="font-semibold text-red-900">+</span> to start a new message.
          </p>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">New Message</h3>
              <button onClick={() => { setShowNewChat(false); setUserSearch(''); setUserResults([]); }} className="p-1 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => searchUsers(e.target.value)}
                placeholder="Search by name or matric number..."
                autoFocus
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm"
              />
              <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                {userResults.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => startDmWithUser(u)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition text-left"
                  >
                    <Avatar firstName={u.firstName} lastName={u.lastName} size="md" photo={u.profilePhoto} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500">{u.matricNo} · {u.currentLevel} Level</p>
                    </div>
                  </button>
                ))}
                {userSearch && userResults.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-4">No users found</p>
                )}
                {!userSearch && (
                  <p className="text-center text-gray-400 text-sm py-4">Start typing to search classmates</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">New Group</h3>
              <button onClick={() => { setShowNewGroup(false); setGroupName(''); setSelectedMembers([]); setUserSearch(''); setUserResults([]); }} className="p-1 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name (e.g. HIS 301 Study Group)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm"
              />
              <div>
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => searchUsers(e.target.value)}
                  placeholder="Add members by name or matric number..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm"
                />
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {userResults.map((u) => {
                    const selected = selectedMembers.find((m) => m._id === u._id);
                    return (
                      <button
                        key={u._id}
                        onClick={() => {
                          if (selected) setSelectedMembers((prev) => prev.filter((m) => m._id !== u._id));
                          else setSelectedMembers((prev) => [...prev, u]);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ${selected ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'}`}
                      >
                        <Avatar firstName={u.firstName} lastName={u.lastName} size="sm" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{u.firstName} {u.lastName}</p>
                          <p className="text-xs text-gray-500">{u.matricNo}</p>
                        </div>
                        {selected && <svg className="w-4 h-4 text-red-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                      </button>
                    );
                  })}
                </div>
              </div>
              {selectedMembers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((m) => (
                    <span key={m._id} className="flex items-center gap-1 bg-red-100 text-red-900 text-xs px-2 py-1 rounded-full">
                      {m.firstName} {m.lastName}
                      <button onClick={() => setSelectedMembers((prev) => prev.filter((x) => x._id !== m._id))}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={handleCreateGroup}
                disabled={!groupName.trim()}
                className="w-full py-2.5 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-40"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityForumPage;
