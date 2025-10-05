import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Home,
  MessageSquare,
  History,
  HelpCircle,
  Settings,
  Crown,
  Plus,
  Search,
  Paperclip,
  AudioLines,
  Navigation,
  Mic,
  MicOff,
  Upload,
  Beaker,
  Building2,
  GraduationCap,
  FileText,
  BarChart3,
  Menu,
  X,
  Brain,
  Lightbulb,
  TrendingUp,
  Moon,
  Sun,
  Activity,
  AlertTriangle,
  FileText as FileTextIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";
import PublicationsView from "@/components/PublicationsView";
import AnalyticsView from "@/components/AnalyticsView";
import ChatHistoryView from "@/components/ChatHistoryView";
import ReadinessMeter from "@/components/ReadinessMeter";
import ContradictionAlerts from "@/components/ContradictionAlerts";
import EvidenceTrail from "@/components/EvidenceTrail";
import SettingsModal from "@/components/SettingsModal";

export default function HomePage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionId] = useState(
    () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [researchMode, setResearchMode] = useState("student");
  const [currentAIFeature, setCurrentAIFeature] = useState(null);
  const queryClient = useQueryClient();

  const characterCount = message.length;
  const maxCharacters = 10000;

  const navItems = [
    { icon: Home, label: "Dashboard", id: "dashboard" },
    { icon: Brain, label: "Research Assistant", id: "research" },
    { icon: FileText, label: "Publications", id: "publications" },
    { icon: BarChart3, label: "Analytics", id: "analytics" },
    { icon: History, label: "Chat History", id: "history" },
  ];

  // Removed mode options - no longer needed

  const promptCards = [
    {
      icon: Beaker,
      title: "Microgravity Effects",
      description:
        "Explore how microgravity affects human physiology during spaceflight missions.",
      query: "How does microgravity affect bone density in astronauts?",
      iconColor: "linear-gradient(135deg, #219079 0%, #4DD0B1 100%)",
    },
    {
      icon: Brain,
      title: "Cardiovascular Health",
      description:
        "Understand cardiovascular changes and adaptations in space environments.",
      query:
        "What cardiovascular changes occur during long-duration spaceflight?",
      iconColor: "#F47B20",
    },
    {
      icon: Lightbulb,
      title: "Plant Biology",
      description:
        "Discover NASA's research on plant growth systems for space habitats.",
      query: "How do plants grow in space environments and Mars habitats?",
      iconColor: "#7056E4",
    },
    {
      icon: TrendingUp,
      title: "Research Trends",
      description:
        "Analyze publication trends and identify knowledge gaps in bioscience research.",
      query: "What are the current research trends in NASA bioscience?",
      iconColor: "linear-gradient(135deg, #5ABCA6 0%, #8BCB9C 100%)",
    },
  ];

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async ({ message }) => {
      // Try POST first
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, sessionId, mode: researchMode }),
        });
        if (response.ok) return response.json();
      } catch (_) {}

      // Fallback to GET (dev proxy route)
      const fallback = await fetch(`/api/chat?message=${encodeURIComponent(message)}&sessionId=${encodeURIComponent(sessionId)}&mode=${encodeURIComponent(researchMode)}`);
      if (!fallback.ok) throw new Error("Failed to send message");
      return fallback.json();
    },
    onSuccess: (data) => {
      // Add assistant response to messages
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          sources: data.sources,
          timestamp: new Date(),
        },
      ]);
      setSelectedSources(data.sources || []);
      setMessage("");
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  // Load chat history
  const { data: chatHistory } = useQuery({
    queryKey: ["chatHistory", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/chat/history?sessionId=${sessionId}`);
      if (!response.ok) throw new Error("Failed to fetch chat history");
      return response.json();
    },
    enabled: !!sessionId,
  });

  useEffect(() => {
    if (chatHistory?.messages) {
      const formattedMessages = chatHistory.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
        sources: msg.sources,
        timestamp: new Date(msg.created_at),
      }));
      setMessages(formattedMessages);
    }
  }, [chatHistory]);

  const handleSendMessage = useCallback(
    async (msgToSend = message) => {
      if (!msgToSend.trim() || chatMutation.isLoading) return;

      // Add user message immediately
      setMessages((prev) => [
        ...prev,
        { role: "user", content: msgToSend, timestamp: new Date() },
      ]);

      // Send to API
      chatMutation.mutate({ message: msgToSend });
    },
    [message, chatMutation],
  );

  const handlePromptCard = useCallback(
    (query) => {
      handleSendMessage(query);
    },
    [handleSendMessage],
  );

  const handleVoiceRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
    }
  }, [isRecording]);

  const handleFileUpload = useCallback(() => {
    // File upload logic here
    console.log("File upload functionality coming soon");
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen font-inter relative overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
        : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'
    }`}>
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute inset-0 transition-all duration-500 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
            : 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100'
        }`}></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236B7280' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse transition-all duration-500 ${
          isDarkMode ? 'bg-purple-500/10' : 'bg-purple-500/5'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 transition-all duration-500 ${
          isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-400/5'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse delay-2000 transition-all duration-500 ${
          isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/5'
        }`}></div>
      </div>
      {/* Mobile Header */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 backdrop-blur-md border-b z-50 px-6 py-4 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-slate-900/80 border-indigo-500/20' 
          : 'bg-white/80 border-slate-300/50'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`mr-3 p-1 rounded-2xl transition-colors ${
                isDarkMode 
                  ? 'hover:bg-indigo-500/20 active:bg-indigo-500/30' 
                  : 'hover:bg-slate-200 active:bg-slate-300'
              }`}
            >
              <Menu size={24} className={isDarkMode ? 'text-white' : 'text-slate-800'} />
            </button>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center mr-3 transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600' 
                  : 'bg-gradient-to-r from-indigo-600 to-blue-700'
              }`}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className={`text-lg font-medium transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
              NASA
            </span>
              <span className={`text-lg font-medium ml-1 transition-colors duration-500 ${
                isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
              }`}>
              Research AI
            </span>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-2xl transition-colors ${
              isDarkMode 
                ? 'hover:bg-indigo-500/20 active:bg-indigo-500/30' 
                : 'hover:bg-slate-200 active:bg-slate-300'
            }`}
          >
            {isDarkMode ? (
              <Sun size={20} className="text-white" />
            ) : (
              <Moon size={20} className="text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Header with Theme Toggle */}
      <div className="hidden lg:block fixed top-0 right-0 z-50 p-6">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-2xl transition-all duration-500 shadow-lg backdrop-blur-md border ${
            isDarkMode 
              ? 'hover:bg-indigo-500/20 active:bg-indigo-500/30 bg-slate-900/50 border-indigo-500/20' 
              : 'hover:bg-slate-200 active:bg-slate-300 bg-white/50 border-slate-300/50'
          }`}
        >
          {isDarkMode ? (
            <Sun size={24} className="text-white" />
          ) : (
            <Moon size={24} className="text-slate-800" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full backdrop-blur-md border-r transition-all duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-80 ${
          isDarkMode 
            ? 'bg-slate-900/90 border-indigo-500/20' 
            : 'bg-white/90 border-slate-300/50'
        }`}
      >
        <div className="p-6 pt-8 h-full flex flex-col overflow-y-auto">
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 hover:bg-purple-500/20 active:bg-purple-500/30 rounded-2xl transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>

          {/* Brand */}
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mr-3">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-medium text-white">
                NASA Research
              </span>
              <span className="text-lg font-medium text-cyan-300 ml-1">
                AI
              </span>
            </div>
          </div>


          {/* New Features Section */}
          <div className="mb-6">
            <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wide transition-colors duration-500 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              AI Features
            </h3>
            <div className="space-y-2">
                  <button
                    onClick={() => {
                      setCurrentAIFeature('storyteller');
                      setActiveNav('AI Storyteller');
                    }}
                    className={`w-full flex items-center p-3 rounded-2xl text-left transition-all duration-200 ${
                      currentAIFeature === 'storyteller'
                        ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border border-purple-500/30"
                        : isDarkMode 
                          ? 'text-slate-300 hover:bg-slate-800/50 active:bg-slate-800/70' 
                          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                    }`}>
                <FileTextIcon size={16} className="mr-3 text-purple-400" />
                    <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    AI Storyteller
                      </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Space experiment stories
                      </div>
                    </div>
                  </button>
              
                  <button 
                    onClick={() => {
                      setCurrentAIFeature('compass');
                      setActiveNav('SpaceBio Compass');
                    }}
                    className={`w-full flex items-center p-3 rounded-2xl text-left transition-all duration-200 ${
                      currentAIFeature === 'compass'
                        ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border border-purple-500/30"
                        : isDarkMode 
                          ? 'text-slate-300 hover:bg-slate-800/50 active:bg-slate-800/70' 
                          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                    }`}>
                <Activity size={16} className="mr-3 text-purple-400" />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    SpaceBio Compass
            </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Mission decision engine
                  </div>
                </div>
              </button>
              
                  <button 
                    onClick={() => {
                      setCurrentAIFeature('predictions');
                      setActiveNav('Future Predictions');
                    }}
                    className={`w-full flex items-center p-3 rounded-2xl text-left transition-all duration-200 ${
                      currentAIFeature === 'predictions'
                        ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border border-purple-500/30"
                        : isDarkMode 
                          ? 'text-slate-300 hover:bg-slate-800/50 active:bg-slate-800/70' 
                          : 'text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                    }`}>
                <TrendingUp size={16} className="mr-3 text-purple-400" />
                <div className="flex-1">
                  <div className={`text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Future Predictions
                  </div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Research direction AI
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            <h3 className={`text-sm font-semibold mb-3 uppercase tracking-wide transition-colors duration-500 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Navigation
            </h3>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.label);
                    setCurrentAIFeature(null);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-white font-bold border border-indigo-500/30"
                      : `${
                          isDarkMode 
                            ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white active:bg-slate-800/70' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200'
                        }`
                  }`}
                >
                  <Icon
                    size={18}
                    className={`mr-3 ${
                      isActive 
                        ? "text-indigo-300" 
                        : (isDarkMode ? "text-slate-500" : "text-slate-400")
                    }`}
                  />
                  <span className={`text-sm transition-colors duration-500 ${
                    isActive 
                      ? 'text-white' 
                      : (isDarkMode ? 'text-slate-300' : 'text-slate-700')
                  }`}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sources Panel */}
          {selectedSources.length > 0 && (
            <div className={`mt-6 p-4 rounded-2xl border transition-all duration-500 ${
              isDarkMode 
                ? 'bg-slate-800/50 border-slate-700/50' 
                : 'bg-slate-100/50 border-slate-300/50'
            }`}>
              <h3 className={`text-sm font-semibold mb-3 transition-colors duration-500 ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Referenced Sources
              </h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedSources.map((source, index) => (
                  <div key={index} className="text-xs">
                    <div className={`font-medium transition-colors duration-500 ${
                      isDarkMode ? 'text-indigo-300' : 'text-indigo-600'
                    }`}>
                      NASA-{source.nasa_id}
                    </div>
                    <div className={`transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    } line-clamp-2`}>
                      {source.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom section */}
          <div className={`space-y-2 pt-6 border-t transition-colors duration-500 ${
            isDarkMode ? 'border-slate-700/50' : 'border-slate-300/50'
          }`}>
            <button 
              onClick={() => setSettingsOpen(true)}
              className={`w-full flex items-center px-4 py-3 rounded-2xl transition-colors ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white active:bg-slate-800/70' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200'
              }`}
            >
              <Settings
                size={18}
                className={`mr-3 transition-colors duration-500 ${
                  isDarkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
              />
              <span className={`text-sm transition-colors duration-500 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Settings</span>
            </button>

            {/* Help button moved just below Settings */}
            <button 
              onClick={() => {
                setActiveNav("Help & Support");
                setCurrentAIFeature(null);
              }}
              className={`w-full flex items-center px-4 py-3 rounded-2xl transition-colors ${
                isDarkMode 
                  ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white active:bg-slate-800/70' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200'
              }`}
            >
              <HelpCircle
                size={18}
                className={`mr-3 transition-colors duration-500 ${
                  isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                }`}
              />
              <span className={`text-sm transition-colors duration-500 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>Help & Support</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80 pt-20 lg:pt-0 relative z-10">
        <div className="px-6 py-6 lg:px-12 lg:py-12 min-h-screen flex flex-col">
          {activeNav === "Dashboard" && !currentAIFeature ? (
            <>
              {/* Dashboard Header */}
              <div className="mb-8">
                <h1 className={`text-4xl font-bold mb-2 transition-colors duration-500 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>Mission Readiness Dashboard</h1>
                <p className={`text-lg transition-colors duration-500 ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}>Real-time assessment of critical exploration challenges</p>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <ReadinessMeter isDarkMode={isDarkMode} />
                <ContradictionAlerts isDarkMode={isDarkMode} />
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <EvidenceTrail isDarkMode={isDarkMode} />
                
                {/* Comparative Study Summaries */}
                <div className={`backdrop-blur-md border rounded-3xl p-8 shadow-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-300/50'
                }`}>
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center mr-4">
                      <BarChart3 size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold transition-colors duration-500 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        Comparative Study Summaries
                      </h2>
                      <p className={`text-sm transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        Multi-study analysis with consensus insights
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Study 1: Microgravity Effects on Bone Density */}
                    <div className={`p-6 rounded-2xl border transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-slate-700/30 border-slate-600/50' 
                        : 'bg-slate-50/50 border-slate-200/50'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold transition-colors duration-500 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          Microgravity Effects on Bone Density
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-lg transition-colors duration-500 ${
                            isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                          }`}>
                            High Consensus
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-lg transition-colors duration-500 ${
                            isDarkMode ? 'bg-slate-600/50 text-slate-300' : 'bg-slate-200 text-slate-600'
                          }`}>
                            7 studies
                          </span>
                        </div>
                      </div>
                      
                      <div className={`text-sm leading-relaxed transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        <p className="mb-3">
                          <strong>Consensus Summary:</strong> 7 studies show consistent bone density loss in astronauts, 
                          with an average reduction of 1-2% per month in weight-bearing bones. 2 studies indicate 
                          partial adaptation after 6 months, but no studies extend beyond 1-year missions.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className={`text-sm font-medium mb-2 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-200' : 'text-slate-700'
                            }`}>
                              Key Findings:
                            </h4>
                            <ul className={`text-xs space-y-1 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <li>• Femur density loss: 1.2% per month</li>
                              <li>• Spine density loss: 1.8% per month</li>
                              <li>• Recovery time: 2-3x mission duration</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className={`text-sm font-medium mb-2 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-200' : 'text-slate-700'
                            }`}>
                              Knowledge Gaps:
                            </h4>
                            <ul className={`text-xs space-y-1 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <li>• Long-duration effects (&gt;2 years)</li>
                              <li>• Individual variation factors</li>
                              <li>• Optimal countermeasure timing</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Study 2: Plant Growth in Space */}
                    <div className={`p-6 rounded-2xl border transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-slate-700/30 border-slate-600/50' 
                        : 'bg-slate-50/50 border-slate-200/50'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold transition-colors duration-500 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          Plant Growth in Space Environments
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-lg transition-colors duration-500 ${
                            isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            Mixed Results
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-lg transition-colors duration-500 ${
                            isDarkMode ? 'bg-slate-600/50 text-slate-300' : 'bg-slate-200 text-slate-600'
                          }`}>
                            5 studies
                          </span>
                        </div>
                      </div>
                      
                      <div className={`text-sm leading-relaxed transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        <p className="mb-3">
                          <strong>Consensus Summary:</strong> 3 studies show successful plant growth in microgravity 
                          with 80-90% Earth-normal yields. 2 studies report significant challenges with root 
                          development and nutrient uptake. No studies address Mars gravity (38% Earth) conditions.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className={`text-sm font-medium mb-2 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-200' : 'text-slate-700'
                            }`}>
                              Successful Species:
                            </h4>
                            <ul className={`text-xs space-y-1 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <li>• Arabidopsis thaliana (100% success)</li>
                              <li>• Lettuce varieties (85% success)</li>
                              <li>• Radish (70% success)</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className={`text-sm font-medium mb-2 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-200' : 'text-slate-700'
                            }`}>
                              Key Challenges:
                            </h4>
                            <ul className={`text-xs space-y-1 transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}>
                              <li>• Root orientation in microgravity</li>
                              <li>• Water distribution systems</li>
                              <li>• Pollination mechanisms</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeNav === "Research Assistant" && !currentAIFeature ? (
            <>
              {/* Top New Chat Button and Research Mode */}
              <div className="flex justify-between items-center mb-8">
                {/* Research Mode Selection */}
                <div className="flex items-center space-x-4">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Research Mode:
                  </span>
                  <div className="flex space-x-2">
                    {[
                      { id: "student", title: "Student", icon: GraduationCap },
                      { id: "scientist", title: "Scientist", icon: Beaker },
                      { id: "researcher", title: "Researcher", icon: Brain }
                    ].map((option) => {
                      const Icon = option.icon;
                      const isActive = researchMode === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setResearchMode(option.id)}
                          className={`flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg"
                              : `${
                                  isDarkMode 
                                    ? 'text-slate-400 hover:bg-slate-800/50 active:bg-slate-800/70' 
                                    : 'text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                                }`
                          }`}
                        >
                          <Icon size={14} className="mr-2" />
                          {option.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMessages([]);
                    setSelectedSources([]);
                    setMessage("");
                  }}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-4 rounded-3xl font-semibold text-sm flex items-center shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus size={16} className="mr-2" />
                  New Research Session
                </button>
              </div>

              {/* Chat Messages */}
              {messages.length > 0 && (
                <div className="mb-8">
                  <div className="space-y-6">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-3xl ${msg.role === "user" ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white" : `${
                            isDarkMode 
                              ? "bg-slate-800/50 backdrop-blur-md border border-slate-700/50" 
                              : "bg-white/80 backdrop-blur-md border border-slate-300/50"
                          }`} rounded-3xl p-6 shadow-sm`}
                        >
                          <div className="whitespace-pre-wrap">
                            {msg.content}
                          </div>
                          {msg.sources && msg.sources.length > 0 && (
                            <div className={`mt-4 pt-4 border-t ${
                              msg.role === "user" ? "border-white/20" : (isDarkMode ? "border-slate-700/50" : "border-slate-300/50")
                            }`}>
                              <div className={`text-sm font-medium mb-2 ${
                                msg.role === "user" ? "text-white/80" : (isDarkMode ? "text-slate-300" : "text-slate-600")
                              }`}>
                                Sources:
                              </div>
                              <div className="space-y-1">
                                {msg.sources.map((source, i) => (
                                  <div
                                    key={i}
                                    className={`text-xs ${
                                      msg.role === "user" ? "text-white/70" : (isDarkMode ? "text-indigo-300" : "text-indigo-600")
                                    }`}
                                  >
                                    NASA-{source.nasa_id}: {source.title}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className={`text-xs mt-2 ${
                            msg.role === "user" ? "text-white/60" : (isDarkMode ? "text-slate-400" : "text-slate-500")
                          }`}>
                            {msg.timestamp?.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Header */}
              {messages.length === 0 && (
                <>
                  <div className="flex flex-col mb-8">
                    <div className="mb-4 lg:mb-0">
                      <p className={`text-base lg:text-lg mb-2 transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Welcome to NASA Bioscience Research AI
                      </p>
                      <h1 className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight transition-colors duration-500 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        Ask me about NASA bioscience research—I'm here to help!
                      </h1>
                      <p className={`text-lg mt-4 transition-colors duration-500 ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Access insights from 608+ NASA bioscience publications.
                        Get comprehensive research assistance with transparent
                        source citations and real-time evidence trails.
                      </p>
                    </div>
                  </div>

                  {/* Explore by ready prompt */}
                  <div className="mb-16">
                    <h2 className={`text-xl sm:text-2xl font-bold mb-8 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Explore research topics
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {promptCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                          <button
                            key={index}
                            onClick={() => handlePromptCard(card.query)}
                            className={`backdrop-blur-md border rounded-3xl p-6 transition-all duration-200 cursor-pointer group text-left ${
                              isDarkMode 
                                ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-800/70 active:border-indigo-500/50 active:bg-slate-800/80' 
                                : 'bg-white/80 border-slate-300/50 hover:border-indigo-500/30 hover:bg-white/90 active:border-indigo-500/50 active:bg-white/95'
                            }`}
                          >
                            <div className="mb-6">
                              <div
                                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                                style={{
                                  background: card.iconColor.includes(
                                    "gradient",
                                  )
                                    ? card.iconColor
                                    : card.iconColor,
                                }}
                              >
                                <Icon size={20} className="text-white" />
                              </div>
                            </div>
                            <h3 className={`text-base sm:text-lg font-bold mb-3 transition-colors duration-500 ${
                              isDarkMode ? 'text-white' : 'text-slate-800'
                            }`}>
                              {card.title}
                            </h3>
                            <p className={`text-sm leading-relaxed transition-colors duration-500 ${
                              isDarkMode ? 'text-slate-300' : 'text-slate-600'
                            }`}>
                              {card.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* Chat Composer */}
              <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-lg sticky bottom-6 transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-700/50' 
                  : 'bg-white/80 border-slate-300/50'
              }`}>
                <div className="relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask about NASA bioscience research..."
                    className={`w-full min-h-[80px] sm:min-h-[120px] text-lg sm:text-xl resize-none border-none outline-none font-inter bg-transparent transition-colors duration-500 ${
                      isDarkMode 
                        ? 'placeholder-slate-400 text-white' 
                        : 'placeholder-slate-500 text-slate-800'
                    }`}
                    style={{ lineHeight: "1.4" }}
                  />
                  <div className={`text-xs text-right mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {characterCount.toLocaleString()}/
                    {maxCharacters.toLocaleString()}
                  </div>
                </div>

                <div className={`h-px mb-4 transition-colors duration-500 ${
                  isDarkMode ? 'bg-slate-700/50' : 'bg-slate-300/50'
                }`}></div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 lg:gap-6">
                    <div className={`flex items-center space-x-2 px-4 py-3 border rounded-2xl transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600/50' 
                        : 'bg-slate-100/50 border-slate-300/50'
                    }`}>
                      <div className="relative">
                        <Brain
                          size={16}
                          className="text-indigo-400"
                        />
                        <Search
                          size={12}
                          className="absolute -top-1 -right-1 text-indigo-400"
                        />
                      </div>
                      <span className={`text-xs sm:text-sm font-medium transition-colors duration-500 ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        {researchMode === 'student' ? 'Student Mode' : 
                         researchMode === 'scientist' ? 'Scientist Mode' : 
                         'Researcher Mode'}
                      </span>
                    </div>

                    <button
                      onClick={handleFileUpload}
                      className={`flex items-center space-x-1 sm:space-x-2 px-3 py-3 rounded-2xl transition-colors ${
                        isDarkMode 
                          ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white active:bg-slate-800/70' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200'
                      }`}
                    >
                      <Paperclip
                        size={16}
                        className={isDarkMode ? "text-slate-400" : "text-slate-500"}
                      />
                      <span className="text-xs sm:text-sm hidden sm:inline">
                        Upload PDF
                      </span>
                    </button>

                    <button
                      onClick={handleVoiceRecording}
                      className={`flex items-center space-x-1 sm:space-x-2 px-3 py-3 rounded-2xl transition-colors ${
                        isRecording
                          ? "text-red-400 bg-red-500/10"
                          : isDarkMode 
                            ? 'text-slate-300 hover:bg-slate-800/50 hover:text-white active:bg-slate-800/70' 
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200'
                      }`}
                    >
                      {isRecording ? (
                        <MicOff size={16} className="text-red-400" />
                      ) : (
                        <Mic
                          size={16}
                          className={isDarkMode ? "text-slate-400" : "text-slate-500"}
                        />
                      )}
                      <span className="text-xs sm:text-sm hidden sm:inline">
                        {isRecording ? "Stop" : "Voice"}
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!message.trim() || chatMutation.isLoading}
                    className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 rounded-3xl flex items-center justify-center text-white shadow-lg hover:shadow-xl active:from-indigo-700 active:to-blue-800 transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                  >
                    <Navigation size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : activeNav === "Publications" && !currentAIFeature ? (
            <PublicationsView />
          ) : activeNav === "Analytics" && !currentAIFeature ? (
            <AnalyticsView />
          ) : activeNav === "Chat History" && !currentAIFeature ? (
            <ChatHistoryView />
          ) : currentAIFeature === 'storyteller' ? (
            <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Futuristic Background - ISS/Deep Space */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900' 
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
                }`}></div>
                {/* Animated Starfield */}
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3Ccircle cx='80' cy='40' r='0.5'/%3E%3Ccircle cx='40' cy='80' r='1.5'/%3E%3Ccircle cx='60' cy='10' r='0.8'/%3E%3Ccircle cx='10' cy='60' r='1.2'/%3E%3Ccircle cx='90' cy='90' r='0.6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                {/* Floating Particles */}
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000 opacity-40"></div>
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse delay-2000 opacity-50"></div>
              </div>

              {/* Mission Log Console Header */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className={`text-4xl font-bold mb-2 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Mission Log Console
                    </h1>
                    <p className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      AI Scientist narrating live from NASA console
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm transition-colors ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>LIVE</span>
                  </div>
                </div>

                {/* Dataset Selection Dropdown */}
                <div className="mb-6">
                  <label className={`block text-sm font-medium mb-2 transition-colors ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Select Mission Dataset
                  </label>
                  <select className={`w-full max-w-md px-4 py-3 rounded-xl border transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-600/50 text-white focus:border-cyan-500' 
                      : 'bg-white/80 border-slate-300/50 text-slate-800 focus:border-cyan-500'
                  }`}>
                    <option>Arabidopsis Gene Study – ISS 2014</option>
                    <option>Bone Density Analysis – ISS 2020-2023</option>
                    <option>Plant Growth Experiment – Mars Simulation</option>
                    <option>Cardiovascular Health Study – Artemis Mission</option>
                  </select>
                </div>
              </div>

              {/* Main Story Card Carousel */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Center Story Card */}
                <div className="lg:col-span-2">
                  <div className={`backdrop-blur-md border rounded-3xl p-8 shadow-2xl transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-slate-800/70 border-cyan-500/30' 
                      : 'bg-white/90 border-cyan-300/50'
                  }`}>
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                        <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold transition-colors duration-500 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          Microgravity and Gene Expression — The ISS Discovery
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className={`text-sm transition-colors ${
                              isDarkMode ? 'text-green-400' : 'text-green-600'
                            }`}>AI Narrating</span>
                          </div>
                          <div className={`text-sm transition-colors ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            Mission: Arabidopsis Gene Study – ISS 2014
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Waveform */}
                    <div className="mb-6">
                      <div className="flex items-center space-x-1 mb-4">
                        {[...Array(20)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-1 transition-all duration-300 ${
                              isDarkMode ? 'bg-cyan-400' : 'bg-cyan-600'
                            }`}
                            style={{
                              height: `${Math.random() * 20 + 10}px`,
                              animationDelay: `${i * 100}ms`
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Story Text */}
                    <div className={`text-base leading-relaxed mb-6 transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <p className="mb-4">
                        "In 2014, aboard the International Space Station, a small Arabidopsis plant revealed something extraordinary. 
                        As it grew in the weightless environment, its genes began to dance differently—expressing proteins 
                        that would never be activated on Earth."
                      </p>
                      <p className="mb-4">
                        "The plant's roots, no longer pulled by gravity, spread outward in all directions like a cosmic web. 
                        Scientists watched as its cells adapted to the absence of directional cues, creating a blueprint 
                        for future space agriculture."
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center">
                        🔊 Listen
                      </button>
                      <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center">
                        📊 See Visualization
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side Widgets */}
                <div className="space-y-6">
                  {/* Key Discoveries */}
                  <div className={`backdrop-blur-md border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700/50' 
                      : 'bg-white/80 border-slate-300/50'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Key Discoveries
                    </h4>
                    <ul className={`space-y-2 text-sm transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      <li>• 247 genes expressed differently in microgravity</li>
                      <li>• Root growth patterns changed by 180°</li>
                      <li>• Protein synthesis increased by 15%</li>
                      <li>• Cell wall composition altered significantly</li>
                    </ul>
                  </div>

                  {/* Science Impact Meter */}
                  <div className={`backdrop-blur-md border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700/50' 
                      : 'bg-white/80 border-slate-300/50'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Science Impact Meter
                    </h4>
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={isDarkMode ? '#374151' : '#e5e7eb'}
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="#10b981"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray="251.2"
                          strokeDashoffset="62.8"
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold transition-colors ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>75%</span>
                      </div>
                    </div>
                    <p className={`text-center text-sm transition-colors ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Educational Impact
                    </p>
                  </div>

                  {/* Share Story */}
                  <div className={`backdrop-blur-md border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-slate-800/50 border-slate-700/50' 
                      : 'bg-white/80 border-slate-300/50'
                  }`}>
                    <h4 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Share Story
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                        Download for Students
                      </button>
                      <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                        Share with Scientists
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Navigation */}
              <div className="relative z-10">
                <div className={`backdrop-blur-md border rounded-3xl p-8 shadow-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-300/50'
                }`}>
                  <h3 className={`text-xl font-semibold mb-6 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Story Navigation
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button className={`p-4 rounded-xl border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600/50 hover:border-cyan-500/50' 
                        : 'bg-slate-50/50 border-slate-200/50 hover:border-cyan-500/50'
                    }`}>
                      <div className={`text-sm font-medium mb-2 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>Previous Story</div>
                      <div className={`text-xs transition-colors ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>Bone Density Mystery</div>
                    </button>
                    <button className={`p-4 rounded-xl border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-cyan-500/20 border-cyan-500/50' 
                        : 'bg-cyan-100/50 border-cyan-300/50'
                    }`}>
                      <div className={`text-sm font-medium mb-2 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>Current Story</div>
                      <div className={`text-xs transition-colors ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>Gene Expression Discovery</div>
                    </button>
                    <button className={`p-4 rounded-xl border transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600/50 hover:border-cyan-500/50' 
                        : 'bg-slate-50/50 border-slate-200/50 hover:border-cyan-500/50'
                    }`}>
                      <div className={`text-sm font-medium mb-2 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>Next Story</div>
                      <div className={`text-xs transition-colors ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}>Cardiovascular Adaptation</div>
                    </button>
                  </div>
                  
                  <div className="flex space-x-4">
                    <input
                      type="text"
                      placeholder="Ask AI to generate a story about..."
                      className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-500 ${
                        isDarkMode 
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-cyan-500' 
                          : 'bg-white/80 border-slate-300/50 text-slate-800 placeholder-slate-500 focus:border-cyan-500'
                      }`}
                    />
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
                      Generate Story
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : currentAIFeature === 'compass' ? (
            <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Mission Control Background */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
                    : 'bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100'
                }`}></div>
                {/* Orbit Map Overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2300bcd4' stroke-width='1' opacity='0.3'%3E%3Ccircle cx='100' cy='100' r='80'/%3E%3Ccircle cx='100' cy='100' r='60'/%3E%3Ccircle cx='100' cy='100' r='40'/%3E%3Cpath d='M20 100 L180 100 M100 20 L100 180'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                {/* Floating Data Nodes */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-1000 opacity-40"></div>
                <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse delay-2000 opacity-50"></div>
              </div>

              {/* Mission Control Header */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className={`text-4xl font-bold mb-2 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      Mission Control Dashboard
                    </h1>
                    <p className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      NASA mission planner's decision cockpit
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm transition-colors ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>SYSTEMS ONLINE</span>
                  </div>
                </div>

                {/* Top Bar Controls */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <div className="flex items-center space-x-4">
                    <label className={`text-sm font-medium transition-colors ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      Mission Context:
                    </label>
                    <select className={`px-4 py-2 rounded-lg border transition-all duration-500 ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-600/50 text-white focus:border-blue-500' 
                        : 'bg-white/80 border-slate-300/50 text-slate-800 focus:border-blue-500'
                    }`}>
                      <option>ISS Operations</option>
                      <option>Artemis Moon Mission</option>
                      <option>Mars Simulation</option>
                      <option>Deep Space Gateway</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium transition-colors ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>View by Category:</span>
                    <div className="flex space-x-2">
                      {['Astronaut Health', 'Plant Growth', 'Microbiology'].map((category) => (
                        <button
                          key={category}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                            isDarkMode 
                              ? 'bg-slate-700/50 text-slate-300 hover:bg-blue-500/20 hover:text-blue-400' 
                              : 'bg-slate-100/50 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Three-Panel Mission Control Layout */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left Panel - Data Cards */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Study Impact Cards
                  </h3>
                  
                  {[
                    { title: 'Radiation Shielding', score: 9.2, status: 'ready', color: 'green' },
                    { title: 'Food Production', score: 7.8, status: 'development', color: 'yellow' },
                    { title: 'Bone Density', score: 4.2, status: 'research', color: 'red' },
                    { title: 'Cardiovascular Health', score: 6.5, status: 'development', color: 'yellow' }
                  ].map((study, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50' 
                          : 'bg-white/80 border-slate-300/50 hover:border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-medium transition-colors ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {study.title}
                        </h4>
                        <div className={`w-3 h-3 rounded-full ${
                          study.color === 'green' ? 'bg-green-500' :
                          study.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                      <div className={`text-sm transition-colors ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        <div className="flex justify-between items-center mb-2">
                          <span>Impact Score</span>
                          <span className="font-semibold">{study.score}/10</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              study.color === 'green' ? 'bg-green-500' :
                              study.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${study.score * 10}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Center Panel - Network Visualization */}
                <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-300/50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Biological Systems Network
                  </h3>
                  
                  {/* Interactive Network Visualization */}
                  <div className="relative h-64 mb-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {/* Central Node */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">ISS</span>
                        </div>
                        
                        {/* Connected Nodes */}
                        {[
                          { angle: 0, label: 'Bone', color: 'red' },
                          { angle: 90, label: 'Heart', color: 'yellow' },
                          { angle: 180, label: 'Plant', color: 'green' },
                          { angle: 270, label: 'Microbe', color: 'purple' }
                        ].map((node, index) => {
                          const x = 50 + 40 * Math.cos((node.angle * Math.PI) / 180);
                          const y = 50 + 40 * Math.sin((node.angle * Math.PI) / 180);
                          return (
                            <div
                              key={index}
                              className={`absolute w-6 h-6 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 ${
                                node.color === 'red' ? 'bg-red-500' :
                                node.color === 'yellow' ? 'bg-yellow-500' :
                                node.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                              }`}
                              style={{
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                            >
                              <span className="text-white text-xs font-bold">{node.label[0]}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`text-sm transition-colors ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    <p className="mb-2">Hover over nodes to see impact summaries:</p>
                    <div className="p-3 rounded-lg bg-slate-100/50">
                      <p className="text-xs">Microbial adaptation affects 3 habitat design parameters</p>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Simulation Widget */}
                <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-300/50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    🎛️ Mission Simulation
                  </h3>
                  
                  {/* If-Then Slider */}
                  <div className="mb-6">
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      If radiation exposure increases by:
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="30"
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className={`text-lg font-semibold transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>30%</span>
                    </div>
                  </div>
                  
                  {/* Output Box */}
                  <div className={`p-4 rounded-xl border mb-4 transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-red-900/20 border-red-500/30' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <h4 className={`text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? 'text-red-400' : 'text-red-700'
                    }`}>
                      Impact Analysis:
                    </h4>
                    <p className={`text-sm transition-colors ${
                      isDarkMode ? 'text-red-300' : 'text-red-600'
                    }`}>
                      High risk to seed viability and muscle regeneration. 
                      Bone density loss would accelerate by 40%.
                    </p>
                  </div>
                  
                  {/* Mission Insight */}
                  <div className={`p-4 rounded-xl border transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-blue-900/20 border-blue-500/30' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <h4 className={`text-sm font-medium mb-2 transition-colors ${
                      isDarkMode ? 'text-blue-400' : 'text-blue-700'
                    }`}>
                      Mission Insight:
                    </h4>
                    <p className={`text-sm transition-colors ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-600'
                    }`}>
                      These findings suggest enhancing shielding in the Mars transit phase 
                      and increasing exercise protocols by 50%.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : currentAIFeature === 'predictions' ? (
            <div className="flex-1 flex flex-col relative overflow-hidden">
              {/* Futuristic AI Foresight Lab Background */}
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900' 
                    : 'bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100'
                }`}></div>
                {/* Holographic Lines */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23a855f7' stroke-width='0.5' opacity='0.3'%3E%3Cpath d='M0 50 L100 50 M50 0 L50 100'/%3E%3Cpath d='M0 25 L100 75 M0 75 L100 25'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                {/* Orbiting Data Nodes */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
                <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse delay-1000 opacity-40"></div>
                <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-2000 opacity-50"></div>
                <div className="absolute top-1/3 right-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse delay-3000 opacity-30"></div>
              </div>

              {/* AI Foresight Lab Header */}
              <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className={`text-4xl font-bold mb-2 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      AI Foresight Lab
                    </h1>
                    <p className={`text-lg transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                      Interacting with an AI oracle guiding NASA's next discoveries
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className={`text-sm transition-colors ${
                      isDarkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>AI ACTIVE</span>
                  </div>
                </div>

                {/* Predictive Insights Overview */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-semibold transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Predictive Insights Overview
                  </h2>
                  <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200">
                    Generate Next 5-Year Projection
                  </button>
                </div>
              </div>

              {/* Main AI Foresight Lab Layout */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Center Panel - AI Trend Map */}
                <div className="lg:col-span-2">
                  <div className={`backdrop-blur-md border rounded-3xl p-8 shadow-2xl transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-slate-800/70 border-purple-500/30' 
                      : 'bg-white/90 border-purple-300/50'
                  }`}>
                    <h3 className={`text-2xl font-bold mb-6 transition-colors duration-500 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      AI Trend Map
                    </h3>
                    
                    {/* 3D Bubble Chart Visualization */}
                    <div className="relative h-80 mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-64 h-64">
                          {/* Central AI Node */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                            <span className="text-white text-lg font-bold">AI</span>
                          </div>
                          
                          {/* Research Topic Bubbles */}
                          {[
                            { angle: 0, label: 'Gene Expression', size: 20, growth: 85, color: 'purple' },
                            { angle: 60, label: 'Agriculture', size: 16, growth: 72, color: 'green' },
                            { angle: 120, label: 'Radiation', size: 14, growth: 68, color: 'blue' },
                            { angle: 180, label: 'Bone Health', size: 18, growth: 45, color: 'red' },
                            { angle: 240, label: 'Microbiology', size: 12, growth: 55, color: 'yellow' },
                            { angle: 300, label: 'Cardiovascular', size: 15, growth: 40, color: 'cyan' }
                          ].map((bubble, index) => {
                            const x = 50 + 35 * Math.cos((bubble.angle * Math.PI) / 180);
                            const y = 50 + 35 * Math.sin((bubble.angle * Math.PI) / 180);
                            return (
                              <div
                                key={index}
                                className={`absolute rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300 ${
                                  bubble.color === 'purple' ? 'bg-purple-500' :
                                  bubble.color === 'green' ? 'bg-green-500' :
                                  bubble.color === 'blue' ? 'bg-blue-500' :
                                  bubble.color === 'red' ? 'bg-red-500' :
                                  bubble.color === 'yellow' ? 'bg-yellow-500' : 'bg-cyan-500'
                                }`}
                                style={{
                                  left: `${x}%`,
                                  top: `${y}%`,
                                  width: `${bubble.size}px`,
                                  height: `${bubble.size}px`,
                                  transform: 'translate(-50%, -50%)',
                                  boxShadow: `0 0 ${bubble.growth/2}px currentColor`
                                }}
                              >
                                <span className="text-white text-xs font-bold">{bubble.label[0]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* Bubble Details */}
                    <div className={`p-4 rounded-xl transition-colors duration-500 ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                    }`}>
                      <h4 className={`text-lg font-semibold mb-2 transition-colors ${
                        isDarkMode ? 'text-white' : 'text-slate-800'
                      }`}>
                        Selected: Microgravity Gene Expression
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className={`transition-colors ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>Predicted Growth:</span>
                          <span className={`ml-2 font-semibold transition-colors ${
                            isDarkMode ? 'text-purple-400' : 'text-purple-600'
                          }`}>+85%</span>
                        </div>
                        <div>
                          <span className={`transition-colors ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>Confidence:</span>
                          <span className={`ml-2 font-semibold transition-colors ${
                            isDarkMode ? 'text-green-400' : 'text-green-600'
                          }`}>92%</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className={`text-sm font-medium mb-1 transition-colors ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          Key Unexplored Questions:
                        </h5>
                        <ul className={`text-xs space-y-1 transition-colors ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          <li>• How do gene networks adapt in multi-generational space environments?</li>
                          <li>• What epigenetic changes persist after return to Earth?</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - AI Assistant Chat */}
                <div className={`backdrop-blur-md border rounded-3xl p-6 shadow-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-300/50'
                }`}>
                  <h3 className={`text-lg font-semibold mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    AI Assistant Chat
                  </h3>
                  
                  {/* Chat Messages */}
                  <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                    }`}>
                      <div className={`text-xs font-medium mb-1 transition-colors ${
                        isDarkMode ? 'text-purple-400' : 'text-purple-600'
                      }`}>
                        AI Oracle
                      </div>
                      <div className={`text-sm transition-colors ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Which plant species should NASA study next for lunar agriculture?
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-lg ${
                      isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                    }`}>
                      <div className={`text-xs font-medium mb-1 transition-colors ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        AI Response
                      </div>
                      <div className={`text-sm transition-colors ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        Based on current research trends, I recommend focusing on:
                        <br/>• Quinoa (high protein, space-efficient)
                        <br/>• Sweet potatoes (radiation resistant)
                        <br/>• Spirulina (complete nutrition)
                        <br/>
                        <span className={`text-xs transition-colors ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          Confidence: 87%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Ask AI about future research..."
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm transition-all duration-500 ${
                        isDarkMode 
                          ? 'bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-purple-500' 
                          : 'bg-white/80 border-slate-300/50 text-slate-800 placeholder-slate-500 focus:border-purple-500'
                      }`}
                    />
                    <button className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Knowledge Gaps Detected */}
              <div className="relative z-10">
                <div className={`backdrop-blur-md border rounded-3xl p-8 shadow-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-300/50'
                }`}>
                  <h3 className={`text-2xl font-bold mb-6 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Knowledge Gaps Detected
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { 
                        title: 'Neural Adaptation in Lunar Gravity', 
                        coverage: 12, 
                        priority: 'high',
                        description: 'Limited research on neurological changes in reduced gravity environments'
                      },
                      { 
                        title: 'Multi-Generational Space Effects', 
                        coverage: 8, 
                        priority: 'high',
                        description: 'No studies on biological changes across multiple generations in space'
                      },
                      { 
                        title: 'Plant-Microbe Symbiosis', 
                        coverage: 25, 
                        priority: 'medium',
                        description: 'Insufficient understanding of beneficial microbial relationships in space agriculture'
                      },
                      { 
                        title: 'Epigenetic Space Modifications', 
                        coverage: 18, 
                        priority: 'medium',
                        description: 'Limited research on heritable genetic changes from space exposure'
                      },
                      { 
                        title: 'AI-Assisted Space Medicine', 
                        coverage: 5, 
                        priority: 'emerging',
                        description: 'Novel field combining artificial intelligence with space medical protocols'
                      },
                      { 
                        title: 'Psychological Adaptation Patterns', 
                        coverage: 15, 
                        priority: 'medium',
                        description: 'Insufficient long-term psychological studies for extended space missions'
                      }
                    ].map((gap, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 cursor-pointer ${
                          gap.priority === 'high' ? (
                            isDarkMode 
                              ? 'bg-red-900/20 border-red-500/30 hover:border-red-400/50' 
                              : 'bg-red-50 border-red-200 hover:border-red-300'
                          ) : gap.priority === 'medium' ? (
                            isDarkMode 
                              ? 'bg-yellow-900/20 border-yellow-500/30 hover:border-yellow-400/50' 
                              : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
                          ) : (
                            isDarkMode 
                              ? 'bg-blue-900/20 border-blue-500/30 hover:border-blue-400/50' 
                              : 'bg-blue-50 border-blue-200 hover:border-blue-300'
                          )
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold text-sm transition-colors ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {gap.title}
                          </h4>
                          <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                            gap.priority === 'high' ? (
                              isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                            ) : gap.priority === 'medium' ? (
                              isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700'
                            ) : (
                              isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                            )
                          }`}>
                            {gap.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className={`text-xs mb-2 transition-colors ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Research Coverage: {gap.coverage}%
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1 mb-2">
                          <div 
                            className={`h-1 rounded-full ${
                              gap.priority === 'high' ? 'bg-red-500' :
                              gap.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${gap.coverage}%` }}
                          ></div>
                        </div>
                        <p className={`text-xs transition-colors ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {gap.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : activeNav === "Help & Support" && !currentAIFeature ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <HelpCircle size={64} className={`mx-auto mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  }`} />
                  <h1 className={`text-3xl font-bold mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Help & Support
                  </h1>
                  <p className={`text-lg mb-8 transition-colors duration-500 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Need assistance? We're here to help you get the most out of NASA Research AI.
                  </p>
                </div>
                
                <div className={`backdrop-blur-md border rounded-3xl p-8 shadow-lg transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700/50' 
                    : 'bg-white/80 border-slate-300/50'
                }`}>
                  <h2 className={`text-xl font-semibold mb-6 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Contact Support
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-4">
                      <div className={`rounded-2xl p-4 transition-all duration-500 ${
                        isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                      }`}>
                        <span className="text-2xl">📞</span>
                      </div>
                      <div className="text-left">
                        <p className={`text-sm transition-colors duration-500 ${
                          isDarkMode ? 'text-slate-400' : 'text-slate-500'
                        }`}>Phone Support</p>
                        <p className={`text-lg font-semibold transition-colors duration-500 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>984562536</p>
                      </div>
                    </div>
                    <div className={`text-sm transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Available 24/7 for technical assistance and questions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-500 ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'
                  }`}>
                    <Navigation size={32} className={`transition-colors duration-500 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 transition-colors duration-500 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Welcome to NASA Research Platform
                  </h2>
                  <p className={`text-lg transition-colors duration-500 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    Select a feature from the sidebar to get started
                  </p>
                </div>
              </div>
            </div>
          )}
          
          
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
