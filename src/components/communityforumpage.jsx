import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = API_URL;

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
  if (photo) return <img src={photo} alt={firstName} className={`${sizes[size]} rounded-full object-cover flex-shrink-0`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-red-900 text-white flex items-center justify-center font-bold flex-shrink-0`}>
      {getInitials(firstName, lastName)}
    </div>
  );
};

const Toast = ({ toast }) => {
  if (!toast) return null;
  const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-gray-800' };
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 rounded-xl shadow-xl text-white text-sm font-semibold ${colors[toast.type] || colors.info}`}>
      {toast.message}
    </div>
  );
};

const CommunityForumPage = ({ user }) => {
  const navigate = useNavigate();
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
  // People tab
  const [peopleList, setPeopleList] = useState([]);
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peopleLoading, setPeopleLoading] = useState(false);
  // Add member to group
  const [showAddMember, setShowAddMember] = useState(false);
  const [addMemberSearch, setAddMemberSearch] = useState('');
  const [addMemberResults, setAddMemberResults] = useState([]);
  const [addingMember, setAddingMember] = useState(false);
  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  // Toast
  const [toast, setToast] = useState(null);
  // DM friend status + message limit
  const [dmFriendStatus, setDmFriendStatus] = useState(null);
  const [messageLimitReached, setMessageLimitReached] = useState(false);
  // Mobile view toggle
  const [mobileView, setMobileView] = useState('sidebar'); // 'sidebar' | 'chat'

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const notifRef = useRef(null);
  const token = localStorage.getItem('token');

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages]);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Connect socket
  useEffect(() => {
    if (!token) return;
    const s = io(SOCKET_URL, { auth: { token } });

    s.on('connect', () => {});

    s.on('new_message', ({ conversationId, message }) => {
      if (activeConv?._id === conversationId) {
        setMessages((prev) => {
          if (prev.find((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
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

    s.on('user_online', ({ userId }) => setOnlineUsers((prev) => new Set([...prev, userId])));
    s.on('user_offline', ({ userId }) => setOnlineUsers((prev) => { const n = new Set(prev); n.delete(userId); return n; }));

    s.on('conversation_ready', ({ conversationId }) => {
      s.emit('join_conversation', { conversationId });
      loadConversations();
    });
    s.on('new_conversation', () => loadConversations());

    s.on('notification', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      showToast(notif.message, 'info');
    });

    s.on('message_limit_reached', ({ message }) => {
      setMessageLimitReached(true);
      showToast(message, 'error');
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
      const res = await api.get('/api/messages/conversations');
      if (res.data.success) setConversations(res.data.data);
    } catch {}
  }, []);

  const loadGroups = useCallback(async () => {
    try {
      const res = await api.get('/api/messages/groups');
      if (res.data.success) setGroups(res.data.data);
    } catch {}
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('/api/friends/notifications');
      if (res.data.success) setNotifications(res.data.data);
    } catch {}
  }, []);

  useEffect(() => {
    loadConversations();
    loadGroups();
    fetchNotifications();
  }, [loadConversations, loadGroups, fetchNotifications]);

  useEffect(() => {
    if (activeTab === 'people' && peopleList.length === 0) loadPeople();
  }, [activeTab]);

  const loadPeople = async (search = '') => {
    setPeopleLoading(true);
    try {
      const res = await api.get(`/api/messages/all-users${search ? `?search=${encodeURIComponent(search)}` : ''}`);
      if (res.data.success) setPeopleList(res.data.data);
    } catch {} finally {
      setPeopleLoading(false);
    }
  };

  const openConversation = async (conv) => {
    setActiveConv(conv);
    setPendingRecipient(null);
    setMessageLimitReached(false);
    setMobileView('chat');
    setDmFriendStatus(null);
    setLoading(true);
    try {
      const res = await api.get(`/api/messages/conversation/${conv._id}`);
      if (res.data.success) setMessages(res.data.data.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
    if (socket) socket.emit('join_conversation', { conversationId: conv._id });

    if (conv.conversationType === 'direct') {
      const other = conv.participants?.find((p) => p._id !== user?.id);
      if (other) {
        try {
          const res = await api.get(`/api/friends/status/${other._id}`);
          if (res.data.success) setDmFriendStatus(res.data.data);
        } catch {}
      }
    }
  };

  const startDmWithUser = (targetUser) => {
    const existing = conversations.find((c) => c.participants.some((p) => p._id === targetUser._id));
    if (existing) {
      openConversation(existing);
    } else {
      setPendingRecipient(targetUser);
      setActiveConv({ _id: null, conversationType: 'direct', participants: [user, targetUser], tempUser: targetUser });
      setMessages([]);
      setDmFriendStatus(null);
      setMessageLimitReached(false);
      setMobileView('chat');
    }
    setShowNewChat(false);
    setUserSearch('');
    setUserResults([]);
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !socket) return;
    if (messageLimitReached) { showToast('Message limit reached. Send a friend request first.', 'error'); return; }
    const content = messageInput.trim();
    setMessageInput('');
    if (pendingRecipient && !activeConv?._id) {
      socket.emit('send_message', { content, recipientId: pendingRecipient._id });
      setPendingRecipient(null);
    } else if (activeConv?._id) {
      socket.emit('send_message', { conversationId: activeConv._id, content });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
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
      const res = await api.get(`/api/messages/users?search=${q}`);
      if (res.data.success) setUserResults(res.data.data);
    } catch {}
  };

  const searchAddMembers = async (q) => {
    setAddMemberSearch(q);
    if (!q.trim()) { setAddMemberResults([]); return; }
    try {
      const res = await api.get(`/api/messages/users?search=${q}`);
      if (res.data.success) {
        const existingIds = new Set(activeConv?.participants?.map((p) => p._id || p) || []);
        setAddMemberResults(res.data.data.filter((u) => !existingIds.has(u._id)));
      }
    } catch {}
  };

  const handleAddMember = async (userId) => {
    if (!activeConv?._id) return;
    setAddingMember(true);
    try {
      const res = await api.post(`/api/messages/groups/${activeConv._id}/add-member`, { userId });
      if (res.data.success) {
        setActiveConv((prev) => ({ ...prev, participants: res.data.data.participants }));
        showToast('Member added!', 'success');
        setAddMemberResults((prev) => prev.filter((u) => u._id !== userId));
        loadGroups();
      }
    } catch {
      showToast('Failed to add member', 'error');
    } finally {
      setAddingMember(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;
    try {
      const res = await api.post('/api/messages/groups', { name: groupName, memberIds: selectedMembers.map((m) => m._id) });
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

  // Friend request actions
  const handleSendRequest = async (targetId) => {
    try {
      const res = await api.post(`/api/friends/request/${targetId}`);
      setPeopleList((prev) => prev.map((u) => u._id === targetId
        ? { ...u, requestStatus: 'sent', requestId: res.data.data?.requestId }
        : u
      ));
      showToast('Friend request sent!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request', 'error');
    }
  };

  const handleAcceptRequest = async (requestId, senderId) => {
    try {
      await api.post(`/api/friends/accept/${requestId}`);
      setNotifications((prev) => prev.map((n) =>
        n.relatedId?.toString() === requestId?.toString() ? { ...n, read: true } : n
      ));
      setPeopleList((prev) => prev.map((u) =>
        u._id === senderId ? { ...u, isFriend: true, requestStatus: null, requestId: null } : u
      ));
      if (dmFriendStatus && !dmFriendStatus.isFriend) {
        setDmFriendStatus({ isFriend: true, requestStatus: null, requestId: null });
        setMessageLimitReached(false);
      }
      showToast('You are now connected!', 'success');
    } catch {
      showToast('Failed to accept request', 'error');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await api.post(`/api/friends/decline/${requestId}`);
      setNotifications((prev) => prev.filter((n) => n.relatedId?.toString() !== requestId?.toString()));
      setPeopleList((prev) => prev.map((u) =>
        u.requestId?.toString() === requestId?.toString() ? { ...u, requestStatus: null, requestId: null } : u
      ));
      showToast('Request declined', 'info');
    } catch {
      showToast('Failed to decline request', 'error');
    }
  };

  const markAllRead = async () => {
    try {
      await api.put('/api/friends/notifications/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const getConvName = (conv) => {
    if (conv.conversationType === 'group') return conv.groupName;
    const other = conv.participants?.find((p) => p._id !== user?.id);
    return other ? `${other.firstName} ${other.lastName}` : 'Unknown';
  };

  const getConvOther = (conv) => conv.participants?.find((p) => p._id !== user?.id);
  const getLastMessage = (conv) => { const msgs = conv.messages || []; return msgs.length ? msgs[msgs.length - 1].content : 'No messages yet'; };
  const getLastTime = (conv) => { const msgs = conv.messages || []; return msgs.length ? formatTime(msgs[msgs.length - 1].timestamp) : ''; };

  const filteredList = activeTab === 'messages'
    ? conversations.filter((c) => getConvName(c).toLowerCase().includes(searchQuery.toLowerCase()))
    : groups.filter((g) => (g.groupName || '').toLowerCase().includes(searchQuery.toLowerCase()));

  const chatTitle = activeConv ? (
    activeConv.conversationType === 'group' ? activeConv.groupName
      : activeConv.tempUser ? `${activeConv.tempUser.firstName} ${activeConv.tempUser.lastName}`
      : getConvName(activeConv)
  ) : '';

  const chatOther = activeConv?.conversationType === 'direct' ? getConvOther(activeConv) : null;
  const isOnline = chatOther && onlineUsers.has(chatOther._id);

  const groupedMessages = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const d = formatDate(msg.timestamp);
    if (d !== lastDate) { groupedMessages.push({ type: 'date', label: d }); lastDate = d; }
    groupedMessages.push({ type: 'message', ...msg });
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const remainingMessages = Math.max(0, 3 - messages.length);
  const showLimit = activeConv?.conversationType === 'direct' && dmFriendStatus && !dmFriendStatus.isFriend;

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-gray-100">

      {/* ── Permanent top bar with back button — always visible ── */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 shadow-sm z-20">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-red-900 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-red-50 active:bg-red-100 transition border border-red-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-gray-800 font-bold text-sm">Community Forum</span>
      </div>

      {/* ── Main forum content: sidebar + chat side by side ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

      {/* Sidebar */}
      <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-shrink-0 min-h-0`}>

        {/* Sidebar header */}
        <div className="bg-red-900 px-3 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar firstName={user?.firstName} lastName={user?.lastName} size="md" photo={user?.profilePhoto} />
            <span className="text-white font-bold text-base">Community</span>
          </div>
          <div className="flex gap-1 items-center">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications((v) => !v); if (!showNotifications) markAllRead(); }}
                className="p-1.5 text-white hover:bg-red-800 rounded-full transition relative"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-red-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-gray-100">
                    <p className="font-bold text-gray-900 text-sm">Notifications</p>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n._id} className={`p-3 border-b border-gray-100 ${!n.read ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start gap-2">
                          <Avatar firstName={n.sender?.firstName} lastName={n.sender?.lastName} size="sm" photo={n.sender?.profilePhoto} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{formatDate(n.createdAt)}</p>
                            {n.type === 'friend_request' && !n.read && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => handleAcceptRequest(n.relatedId, n.sender?._id)}
                                  className="px-3 py-1 bg-red-900 text-white text-xs font-semibold rounded-full hover:bg-red-800 transition"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleDeclineRequest(n.relatedId)}
                                  className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full hover:bg-gray-200 transition"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <button onClick={() => { setShowNewChat(true); setActiveTab('messages'); }} title="New Message" className="p-1.5 text-white hover:bg-red-800 rounded-full transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button onClick={() => { setShowNewGroup(true); setActiveTab('groups'); }} title="New Group" className="p-1.5 text-white hover:bg-red-800 rounded-full transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search (messages/groups tabs only) */}
        {activeTab !== 'people' && (
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search" className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-red-300" />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {['messages', 'groups', 'people'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${activeTab === tab ? 'text-red-900 border-b-2 border-red-900' : 'text-gray-500 hover:text-red-900'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ← Back button — always visible in sidebar, every tab */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 w-full px-4 py-3 bg-red-50 border-b-2 border-red-200 text-red-900 font-bold text-sm hover:bg-red-100 active:bg-red-200 transition flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          ← Back to Previous Page
        </button>

        {/* People list */}
        {activeTab === 'people' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-100">
              <input type="text" value={peopleSearch}
                onChange={(e) => { setPeopleSearch(e.target.value); loadPeople(e.target.value); }}
                placeholder="Search classmates..." className="w-full px-3 py-1.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-red-300" />
            </div>
            <div className="flex-1 overflow-y-auto">
              {peopleLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="w-6 h-6 border-4 border-red-900 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : peopleList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400 text-center px-4">
                  <p className="text-3xl mb-2">👥</p>
                  <p className="text-sm">No classmates found</p>
                </div>
              ) : (
                peopleList.map((u) => (
                  <div key={u._id} className="flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 hover:bg-gray-50">
                    <Avatar firstName={u.firstName} lastName={u.lastName} size="md" photo={u.profilePhoto} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500">Level {u.currentLevel}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 items-center">
                      {/* Message button */}
                      <button onClick={() => { startDmWithUser(u); setActiveTab('messages'); }}
                        title="Message" className="p-1.5 text-gray-500 hover:text-red-900 hover:bg-red-50 rounded-full transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      {/* Connect button states */}
                      {u.isFriend ? (
                        <span title="Connected" className="p-1.5 text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      ) : u.requestStatus === 'sent' ? (
                        <span title="Request sent" className="text-xs text-gray-400 font-medium px-1">Pending</span>
                      ) : u.requestStatus === 'received' ? (
                        <div className="flex gap-1">
                          <button onClick={() => handleAcceptRequest(u.requestId, u._id)}
                            title="Accept" className="p-1 text-green-600 hover:bg-green-50 rounded-full transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeclineRequest(u.requestId)}
                            title="Decline" className="p-1 text-red-500 hover:bg-red-50 rounded-full transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleSendRequest(u._id)} title="Connect"
                          className="p-1.5 text-gray-500 hover:text-red-900 hover:bg-red-50 rounded-full transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Conversations / Groups list */}
        {activeTab !== 'people' && (
          <div className="flex-1 overflow-y-auto">
            {filteredList.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 px-6 text-center">
                <p className="text-3xl mb-2">{activeTab === 'messages' ? '💬' : '👥'}</p>
                <p className="font-semibold text-sm">{activeTab === 'messages' ? 'No conversations yet' : 'No groups yet'}</p>
                <p className="text-xs mt-1">{activeTab === 'messages' ? 'Tap + to start a chat' : 'Tap the group icon to create one'}</p>
              </div>
            ) : (
              filteredList.map((conv) => {
                const isActive = activeConv?._id === conv._id;
                const other = getConvOther(conv);
                const online = other && onlineUsers.has(other._id);
                return (
                  <button key={conv._id} onClick={() => openConversation(conv)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors text-left ${isActive ? 'bg-red-50' : ''}`}>
                    <div className="relative">
                      {conv.conversationType === 'group' ? (
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                          {(conv.groupName || 'G')[0].toUpperCase()}
                        </div>
                      ) : (
                        <Avatar firstName={other?.firstName} lastName={other?.lastName} size="md" photo={other?.profilePhoto} />
                      )}
                      {online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
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
        )}
      </div>

      {/* Chat area */}
      <div className={`${mobileView === 'sidebar' ? 'hidden' : 'flex'} md:flex flex-1 flex-col min-w-0 min-h-0 overflow-hidden`}>
      {activeConv ? (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Chat header */}
          <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-3 flex items-center gap-2 md:gap-3 shadow-sm flex-shrink-0 overflow-hidden">
            {/* Back button — all screens */}
            <button
              onClick={() => { setActiveConv(null); setMobileView('sidebar'); }}
              className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0 transition text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-semibold">Back</span>
            </button>
            <div className="relative flex-shrink-0">
              {activeConv.conversationType === 'group' ? (
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  {(activeConv.groupName || 'G')[0].toUpperCase()}
                </div>
              ) : (
                <Avatar firstName={chatOther?.firstName || activeConv.tempUser?.firstName}
                  lastName={chatOther?.lastName || activeConv.tempUser?.lastName} size="md" />
              )}
              {activeConv.conversationType === 'direct' && (
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{chatTitle}</p>
              {activeConv.conversationType === 'group' ? (
                <button onClick={() => { setShowAddMember(true); setAddMemberSearch(''); setAddMemberResults([]); }}
                  className="text-xs text-red-700 hover:underline font-semibold">
                  {activeConv.participants?.length || 0} members · + Add People
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <p className={`text-xs font-medium ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Message limit banner */}
          {showLimit && (
            <div className={`px-4 py-2 text-sm text-center font-medium flex-shrink-0 ${messageLimitReached ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'}`}>
              {messageLimitReached
                ? 'Message limit reached. Send a friend request to unlock unlimited messaging.'
                : `${remainingMessages} message${remainingMessages !== 1 ? 's' : ''} remaining — send a friend request to unlock unlimited messaging.`}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 md:p-4 space-y-1"
            style={{ backgroundImage: 'radial-gradient(circle, #e5e5e5 1px, transparent 1px)', backgroundSize: '20px 20px', backgroundColor: '#f0f0f0' }}>
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
                const senderName = item.sender?.firstName ? `${item.sender.firstName} ${item.sender.lastName}` : item.sender?.fullName || '';
                return (
                  <div key={item._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1 min-w-0`}>
                    <div className="max-w-[80%] md:max-w-[65%] min-w-0">
                      {!isOwn && activeConv.conversationType === 'group' && (
                        <p className="text-xs text-red-700 font-semibold mb-0.5 ml-1 truncate">{senderName}</p>
                      )}
                      <div className={`px-3 py-2 rounded-lg shadow-sm ${isOwn ? 'bg-red-900 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{item.content}</p>
                        <p className={`text-xs mt-0.5 text-right ${isOwn ? 'text-red-200' : 'text-gray-400'}`}>{formatTime(item.timestamp)}</p>
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
          <div className="bg-white border-t border-gray-200 px-3 md:px-4 py-3 flex items-end gap-2 md:gap-3 flex-shrink-0">
            <textarea value={messageInput}
              onChange={(e) => { setMessageInput(e.target.value); handleTyping(); }}
              onKeyDown={handleKeyDown}
              placeholder={messageLimitReached ? 'Message limit reached…' : 'Type a message'}
              disabled={messageLimitReached}
              rows={1}
              className="flex-1 resize-none overflow-y-auto px-4 py-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-200 disabled:opacity-50 leading-relaxed"
              style={{ fontSize: '16px', minHeight: '44px', maxHeight: '88px' }}
            />
            <button onClick={sendMessage} disabled={!messageInput.trim() || messageLimitReached}
              className="w-11 h-11 bg-red-900 text-white rounded-full flex items-center justify-center hover:bg-red-800 active:scale-95 transition disabled:opacity-40 flex-shrink-0">
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
          <p className="text-gray-500 max-w-sm">Select a conversation or tap <span className="font-semibold text-red-900">+</span> to start a new message.</p>
        </div>
      )}
      </div>

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
              <input type="text" value={userSearch} onChange={(e) => searchUsers(e.target.value)}
                placeholder="Search by name or matric number..." autoFocus
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm" />
              <div className="mt-3 space-y-1 max-h-64 overflow-y-auto">
                {userResults.map((u) => (
                  <button key={u._id} onClick={() => startDmWithUser(u)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition text-left">
                    <Avatar firstName={u.firstName} lastName={u.lastName} size="md" photo={u.profilePhoto} />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500">{u.matricNo} · Level {u.currentLevel}</p>
                    </div>
                  </button>
                ))}
                {userSearch && userResults.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No users found</p>}
                {!userSearch && <p className="text-center text-gray-400 text-sm py-4">Start typing to search classmates</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Group Modal */}
      {showNewGroup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
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
              <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)}
                placeholder="Group name (e.g. HIS 301 Study Group)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Search and tap to select multiple members</p>
              <input type="text" value={userSearch} onChange={(e) => searchUsers(e.target.value)}
                  placeholder="Search by name or matric number..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm" />
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {userResults.map((u) => {
                    const selected = selectedMembers.find((m) => m._id === u._id);
                    return (
                      <button key={u._id} onClick={() => {
                        if (selected) setSelectedMembers((prev) => prev.filter((m) => m._id !== u._id));
                        else setSelectedMembers((prev) => [...prev, u]);
                      }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-left ${selected ? 'bg-red-50 border border-red-200' : 'hover:bg-gray-50'}`}>
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
              <button onClick={handleCreateGroup} disabled={!groupName.trim()}
                className="w-full py-2.5 bg-red-900 text-white font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-40">
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

      </div> {/* end flex-1 min-h-0 row */}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Add People to Group</h3>
                <p className="text-xs text-gray-500 mt-0.5">{activeConv?.groupName}</p>
              </div>
              <button onClick={() => setShowAddMember(false)} className="p-1 hover:bg-gray-100 rounded-full">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-5 space-y-3">
              <input type="text" value={addMemberSearch} onChange={(e) => searchAddMembers(e.target.value)}
                placeholder="Search by name or matric number..." autoFocus
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-red-900 text-sm" />
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {addMemberResults.length === 0 && addMemberSearch && (
                  <p className="text-center text-gray-400 text-sm py-4">No users found</p>
                )}
                {!addMemberSearch && (
                  <p className="text-center text-gray-400 text-sm py-4">Search for classmates to add</p>
                )}
                {addMemberResults.map((u) => (
                  <div key={u._id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg">
                    <Avatar firstName={u.firstName} lastName={u.lastName} size="md" photo={u.profilePhoto} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-500">{u.matricNo} · Level {u.currentLevel}</p>
                    </div>
                    <button onClick={() => handleAddMember(u._id)} disabled={addingMember}
                      className="px-3 py-1.5 bg-red-900 text-white text-xs font-semibold rounded-lg hover:bg-red-800 transition disabled:opacity-50">
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
};

export default CommunityForumPage;
