import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MessageSquare, Clock, User, Bot, Trash2, Filter, Calendar } from 'lucide-react';

export default function ChatHistoryView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);

  // Fetch all chat sessions
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: async () => {
      const response = await fetch('/api/chat/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    },
  });

  // Fetch messages for selected session
  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', selectedSession],
    queryFn: async () => {
      if (!selectedSession) return null;
      const response = await fetch(`/api/chat/history?sessionId=${selectedSession}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!selectedSession,
  });

  const sessions = sessionsData?.sessions || [];
  const messages = messagesData?.messages || [];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.session_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.last_message && session.last_message.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMode = selectedMode === 'all' || session.user_mode === selectedMode;
    
    return matchesSearch && matchesMode;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'scientist': return 'from-[#219079] to-[#4DD0B1]';
      case 'manager': return 'from-[#F47B20] to-[#FF8C42]';
      case 'student': return 'from-[#7056E4] to-[#8B7AE6]';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getModeLabel = (mode) => {
    switch (mode) {
      case 'scientist': return 'Scientist';
      case 'manager': return 'Manager';
      case 'student': return 'Student';
      default: return 'Unknown';
    }
  };

  if (sessionsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded-2xl animate-pulse"></div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E1E] dark:text-white">Chat History</h1>
        <p className="text-[#70757F] dark:text-[#A8ADB4] mt-1">
          Browse your previous research conversations
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#70757F] dark:text-[#A8ADB4]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-[#F7F7F7] dark:bg-[#262626] border border-[#E2E2E2] dark:border-[#404040] rounded-xl text-[#1E1E1E] dark:text-white placeholder-[#B4B4B4] dark:placeholder-[#70757F] focus:outline-none focus:ring-2 focus:ring-[#219079] dark:focus:ring-[#4DD0B1]"
            />
          </div>
          <div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-4 py-3 bg-[#F7F7F7] dark:bg-[#262626] border border-[#E2E2E2] dark:border-[#404040] rounded-xl text-[#1E1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#219079] dark:focus:ring-[#4DD0B1]"
            >
              <option value="all">All Modes</option>
              <option value="scientist">Scientist Mode</option>
              <option value="manager">Manager Mode</option>
              <option value="student">Student Mode</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">
              Sessions ({filteredSessions.length})
            </h3>
          </div>
          
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare size={32} className="mx-auto text-[#70757F] dark:text-[#A8ADB4] mb-3" />
              <p className="text-[#70757F] dark:text-[#A8ADB4]">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredSessions.map((session) => (
                <button
                  key={session.session_id}
                  onClick={() => setSelectedSession(session.session_id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                    selectedSession === session.session_id
                      ? 'border-[#219079] dark:border-[#4DD0B1] bg-[#219079]/5 dark:bg-[#4DD0B1]/5'
                      : 'border-[#E2E2E2] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] hover:border-[#D6D6D6] dark:hover:border-[#404040]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${getModeColor(session.user_mode)}`}></div>
                      <span className="text-xs font-medium text-[#70757F] dark:text-[#A8ADB4]">
                        {getModeLabel(session.user_mode)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#70757F] dark:text-[#A8ADB4]">
                      <Clock size={12} />
                      {formatDate(session.updated_at)}
                    </div>
                  </div>
                  
                  <div className="text-sm text-[#1E1E1E] dark:text-white font-medium mb-1">
                    Session {session.session_id.split('_')[1]}
                  </div>
                  
                  {session.last_message && (
                    <p className="text-sm text-[#70757F] dark:text-[#A8ADB4] line-clamp-2">
                      {session.last_message}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-[#70757F] dark:text-[#A8ADB4]">
                      {session.message_count} messages
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages Display */}
        <div className="lg:col-span-2">
          {!selectedSession ? (
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-[#70757F] dark:text-[#A8ADB4] mb-4" />
              <h3 className="text-lg font-medium text-[#1E1E1E] dark:text-white mb-2">
                Select a conversation
              </h3>
              <p className="text-[#70757F] dark:text-[#A8ADB4]">
                Choose a session from the list to view the conversation history
              </p>
            </div>
          ) : messagesLoading ? (
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                      <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl">
              {/* Chat Header */}
              <div className="p-6 border-b border-[#E2E2E2] dark:border-[#333333]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#1E1E1E] dark:text-white">
                      Session {selectedSession.split('_')[1]}
                    </h3>
                    <p className="text-sm text-[#70757F] dark:text-[#A8ADB4]">
                      {messages.length} messages
                    </p>
                  </div>
                  <button className="p-2 text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#262626] rounded-xl transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 max-h-[500px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#70757F] dark:text-[#A8ADB4]">No messages in this session</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.role === 'user' 
                            ? 'bg-gradient-to-r from-[#219079] to-[#4DD0B1]' 
                            : 'bg-gradient-to-r from-[#7056E4] to-[#8B7AE6]'
                        }`}>
                          {message.role === 'user' ? (
                            <User size={16} className="text-white" />
                          ) : (
                            <Bot size={16} className="text-white" />
                          )}
                        </div>
                        
                        <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-4 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-gradient-to-r from-[#219079] to-[#4DD0B1] text-white'
                              : 'bg-[#F7F7F7] dark:bg-[#262626] text-[#1E1E1E] dark:text-white'
                          }`}>
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </div>
                            
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/20 dark:border-[#404040]">
                                <div className="text-xs opacity-80 mb-2">Sources:</div>
                                <div className="space-y-1">
                                  {message.sources.map((source, i) => (
                                    <div key={i} className="text-xs opacity-90">
                                      NASA-{source.nasa_id}: {source.title}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className={`text-xs text-[#70757F] dark:text-[#A8ADB4] mt-1 ${
                            message.role === 'user' ? 'text-right' : 'text-left'
                          }`}>
                            {formatDate(message.created_at)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}