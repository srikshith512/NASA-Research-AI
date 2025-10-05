import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, BookOpen, Users, Calendar, Brain, 
  BarChart3, PieChart as PieChartIcon, Target, AlertTriangle 
} from 'lucide-react';

export default function AnalyticsView() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
  });

  const overview = data?.overview || {};
  const charts = data?.charts || {};
  const insights = data?.insights || {};

  const COLORS = ['#219079', '#4DD0B1', '#F47B20', '#FF8C42', '#7056E4', '#8B7AE6', '#5ABCA6', '#8BCB9C'];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Failed to load analytics</div>
          <div className="text-sm text-gray-500">Please try again later</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6 animate-pulse">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6 animate-pulse">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E1E1E] dark:text-white">Research Analytics</h1>
        <p className="text-[#70757F] dark:text-[#A8ADB4] mt-1">
          Insights and trends from NASA bioscience research publications
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#219079] to-[#4DD0B1] rounded-2xl flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {overview.totalPublications?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Total Publications</div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#F47B20] to-[#FF8C42] rounded-2xl flex items-center justify-center">
              <Target size={24} className="text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {overview.totalAreas || 0}
          </div>
          <div className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Research Areas</div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#7056E4] to-[#8B7AE6] rounded-2xl flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {overview.totalAuthors || 0}
          </div>
          <div className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Unique Authors</div>
        </div>

        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#5ABCA6] to-[#8BCB9C] rounded-2xl flex items-center justify-center">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#1E1E1E] dark:text-white mb-1">
            {overview.recentPublications || 0}
          </div>
          <div className="text-sm text-[#70757F] dark:text-[#A8ADB4]">Recent (5 years)</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publications by Year */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 size={20} className="text-[#219079] dark:text-[#4DD0B1]" />
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Publications by Year</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.publicationsByYear || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E2" />
              <XAxis 
                dataKey="year" 
                stroke="#70757F" 
                fontSize={12}
              />
              <YAxis 
                stroke="#70757F" 
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#219079" 
                strokeWidth={3}
                dot={{ fill: '#219079', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#219079', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Publications by Research Area */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon size={20} className="text-[#219079] dark:text-[#4DD0B1]" />
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Research Areas</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.publicationsByArea || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ area, percent }) => `${area}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(charts.publicationsByArea || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Keywords */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain size={20} className="text-[#219079] dark:text-[#4DD0B1]" />
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Top Keywords</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={(charts.topKeywords || []).slice(0, 10)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E2" />
              <XAxis 
                type="number" 
                stroke="#70757F" 
                fontSize={12}
              />
              <YAxis 
                dataKey="keyword" 
                type="category" 
                stroke="#70757F" 
                fontSize={11}
                width={100}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="count" fill="#219079" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chat Activity */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp size={20} className="text-[#219079] dark:text-[#4DD0B1]" />
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Chat Activity</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.chatActivity || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E2" />
              <XAxis 
                dataKey="month" 
                stroke="#70757F" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
              />
              <YAxis 
                stroke="#70757F" 
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1E1E1E', 
                  border: 'none', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              />
              <Bar dataKey="messages" fill="#F47B20" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Research Gaps */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle size={20} className="text-[#F47B20]" />
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Research Gaps</h3>
          </div>
          <div className="space-y-3">
            {(insights.researchGaps || []).slice(0, 5).map((gap, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F7F7F7] dark:bg-[#262626] rounded-xl">
                <span className="text-sm text-[#1E1E1E] dark:text-white font-medium">
                  {gap.area}
                </span>
                <span className="text-xs bg-[#F47B20] text-white px-2 py-1 rounded-lg">
                  {gap.publicationCount} publications
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-[#FFF8F0] dark:bg-[#2A1F1A] rounded-xl">
            <p className="text-xs text-[#F47B20] dark:text-[#FF8C42]">
              💡 These areas have limited research and may represent opportunities for new studies
            </p>
          </div>
        </div>

        {/* Top Authors */}
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users size={20} className="text-[#219079] dark:text-[#4DD0B1]" />
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Most Productive Authors</h3>
          </div>
          <div className="space-y-3">
            {(charts.topAuthors || []).slice(0, 5).map((author, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#F7F7F7] dark:bg-[#262626] rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#219079] to-[#4DD0B1] rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-sm text-[#1E1E1E] dark:text-white font-medium">
                    {author.author?.split(',')[0] || 'Unknown'}
                  </span>
                </div>
                <span className="text-xs bg-[#219079] text-white px-2 py-1 rounded-lg">
                  {author.count} publications
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Topics */}
      {charts.popularTopics && charts.popularTopics.length > 0 && (
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Brain size={20} className="text-[#219079] dark:text-[#4DD0B1]" />
            <h3 className="text-lg font-semibold text-[#1E1E1E] dark:text-white">Most Asked About Topics</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {charts.popularTopics.slice(0, 6).map((topic, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-[#219079]/10 to-[#4DD0B1]/10 dark:from-[#219079]/20 dark:to-[#4DD0B1]/20 rounded-xl">
                <div className="text-sm font-medium text-[#1E1E1E] dark:text-white mb-1">
                  {topic.topic}
                </div>
                <div className="text-xs text-[#70757F] dark:text-[#A8ADB4]">
                  {topic.mentions} mentions in chat
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}