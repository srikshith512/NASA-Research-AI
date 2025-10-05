import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, ExternalLink, BookOpen, Calendar, Users, Tag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function PublicationsView() {
  const [search, setSearch] = useState('');
  const [researchArea, setResearchArea] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Fetch publications with filters
  const { data, isLoading, error } = useQuery({
    queryKey: ['publications', search, researchArea, yearFrom, yearTo, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
      
      if (search) params.append('search', search);
      if (researchArea) params.append('researchArea', researchArea);
      if (yearFrom) params.append('yearFrom', yearFrom);
      if (yearTo) params.append('yearTo', yearTo);

      const response = await fetch(`/api/publications?${params}`);
      if (!response.ok) throw new Error('Failed to fetch publications');
      return response.json();
    },
  });

  const publications = data?.publications || [];
  const pagination = data?.pagination || {};
  const filters = data?.filters || {};

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setResearchArea('');
    setYearFrom('');
    setYearTo('');
    setCurrentPage(1);
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 mb-2">Failed to load publications</div>
          <div className="text-sm text-gray-500">Please try again later</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1E1E] dark:text-white">NASA Publications</h1>
          <p className="text-[#70757F] dark:text-[#A8ADB4] mt-1">
            Browse and search through {pagination.total || 0} bioscience research publications
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-[#F7F7F7] dark:bg-[#262626] hover:bg-[#EDEDED] dark:hover:bg-[#333333] rounded-xl transition-colors"
        >
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className={`sticky top-0 z-40 bg-white dark:bg-[#121212] transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'}`}>
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search size={isScrolled ? 16 : 20} className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-[#70757F] dark:text-[#A8ADB4] transition-all duration-300`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isScrolled ? "Search publications..." : "Search publications by title, author, abstract, or keywords..."}
              className={`w-full pl-12 pr-4 bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] text-[#1E1E1E] dark:text-white placeholder-[#B4B4B4] dark:placeholder-[#70757F] focus:outline-none focus:ring-2 focus:ring-[#219079] dark:focus:ring-[#4DD0B1] focus:border-transparent transition-all duration-300 ${
                isScrolled ? 'py-2 rounded-xl' : 'py-4 rounded-2xl'
              }`}
            />
          </div>
        </form>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] dark:text-white mb-2">
                Research Area
              </label>
              <select
                value={researchArea}
                onChange={(e) => setResearchArea(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#262626] border border-[#E2E2E2] dark:border-[#404040] rounded-xl text-[#1E1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#219079] dark:focus:ring-[#4DD0B1]"
              >
                <option value="">All Areas</option>
                {filters.researchAreas?.map((area) => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] dark:text-white mb-2">
                Year From
              </label>
              <input
                type="number"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
                min={filters.yearRange?.min_year || 1990}
                max={filters.yearRange?.max_year || 2024}
                className="w-full px-3 py-2 bg-white dark:bg-[#262626] border border-[#E2E2E2] dark:border-[#404040] rounded-xl text-[#1E1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#219079] dark:focus:ring-[#4DD0B1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E1E1E] dark:text-white mb-2">
                Year To
              </label>
              <input
                type="number"
                value={yearTo}
                onChange={(e) => setYearTo(e.target.value)}
                min={filters.yearRange?.min_year || 1990}
                max={filters.yearRange?.max_year || 2024}
                className="w-full px-3 py-2 bg-white dark:bg-[#262626] border border-[#E2E2E2] dark:border-[#404040] rounded-xl text-[#1E1E1E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#219079] dark:focus:ring-[#4DD0B1]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full px-4 py-2 text-[#219079] dark:text-[#4DD0B1] hover:bg-[#219079]/10 dark:hover:bg-[#4DD0B1]/10 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {/* Publications Grid */}
      {!isLoading && publications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((publication) => (
            <div key={publication.id} className="bg-white dark:bg-[#1E1E1E] border border-[#E2E2E2] dark:border-[#333333] rounded-2xl p-6 hover:border-[#219079] dark:hover:border-[#4DD0B1] transition-all duration-200 group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#219079] to-[#4DD0B1] rounded-lg flex items-center justify-center">
                    <BookOpen size={16} className="text-white" />
                  </div>
                  <span className="text-xs font-medium text-[#219079] dark:text-[#4DD0B1]">
                    NASA-{publication.nasa_publication_id || publication.id}
                  </span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#F7F7F7] dark:hover:bg-[#262626] rounded-lg">
                  <ExternalLink size={14} className="text-[#70757F] dark:text-[#A8ADB4]" />
                </button>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-[#1E1E1E] dark:text-white mb-3 line-clamp-2 leading-snug">
                {publication.title}
              </h3>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-[#70757F] dark:text-[#A8ADB4] mb-3">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  {publication.publication_year}
                </div>
                <div className="flex items-center gap-1">
                  <Users size={12} />
                  {publication.authors?.split(',')[0] || 'Unknown'}
                  {publication.authors?.split(',').length > 1 && ' et al.'}
                </div>
              </div>

              {/* Research Area */}
              {publication.research_area && (
                <div className="flex items-center gap-1 mb-3">
                  <Tag size={12} className="text-[#219079] dark:text-[#4DD0B1]" />
                  <span className="text-xs text-[#219079] dark:text-[#4DD0B1] font-medium">
                    {publication.research_area}
                  </span>
                </div>
              )}

              {/* Abstract */}
              <p className="text-sm text-[#70757F] dark:text-[#A8ADB4] line-clamp-3 leading-relaxed mb-4">
                {truncateText(publication.abstract)}
              </p>

              {/* Keywords */}
              {publication.keywords && publication.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {publication.keywords.slice(0, 3).map((keyword, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-[#F7F7F7] dark:bg-[#262626] text-[#70757F] dark:text-[#A8ADB4] rounded-lg">
                      {keyword}
                    </span>
                  ))}
                  {publication.keywords.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-[#F7F7F7] dark:bg-[#262626] text-[#70757F] dark:text-[#A8ADB4] rounded-lg">
                      +{publication.keywords.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && publications.length === 0 && (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-[#70757F] dark:text-[#A8ADB4] mb-4" />
          <h3 className="text-lg font-medium text-[#1E1E1E] dark:text-white mb-2">No publications found</h3>
          <p className="text-[#70757F] dark:text-[#A8ADB4] mb-4">
            Try adjusting your search terms or filters
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-[#219079] hover:bg-[#1E8169] text-white rounded-xl transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-[#70757F] dark:text-[#A8ADB4] hover:text-[#1E1E1E] dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#219079] text-white'
                    : 'text-[#70757F] dark:text-[#A8ADB4] hover:bg-[#F7F7F7] dark:hover:bg-[#262626]'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
            disabled={currentPage === pagination.totalPages}
            className="px-4 py-2 text-[#70757F] dark:text-[#A8ADB4] hover:text-[#1E1E1E] dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}