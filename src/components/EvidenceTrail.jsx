import React, { useState } from 'react';
import { FileText, Quote, ExternalLink, Calendar, User, Hash, ChevronDown, ChevronUp } from 'lucide-react';

const EvidenceTrail = ({ isDarkMode = true }) => {
  const [selectedEvidence, setSelectedEvidence] = useState(null);

  const evidenceData = [
    {
      id: 'bone-density-1',
      title: 'Bone Density Countermeasures - Mission Ready',
      score: 89,
      status: 'mission-ready',
      sources: [
        {
          id: 'nasa-2023-001',
          title: 'Long-term Effects of Exercise on Astronaut Bone Density',
          authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Lisa Rodriguez'],
          year: 2023,
          journal: 'Journal of Space Medicine',
          volume: '45',
          pages: '234-251',
          doi: '10.1016/j.jsm.2023.04.015',
          quotes: [
            {
              text: 'Our 12-month study demonstrated a 23% reduction in bone loss among astronauts who followed the prescribed exercise regimen compared to the control group.',
              page: 240,
              paragraph: 3
            },
            {
              text: 'The combination of resistance training and vibration therapy showed the most promising results for maintaining bone density in microgravity environments.',
              page: 245,
              paragraph: 1
            }
          ],
          methodology: 'Randomized controlled trial with 24 astronauts over 12 months',
          confidence: 92
        },
        {
          id: 'nasa-2022-045',
          title: 'Exercise Protocols for Space Missions: A Comprehensive Review',
          authors: ['Dr. Robert Kim', 'Dr. Amanda Wilson'],
          year: 2022,
          journal: 'Space Biology Research',
          volume: '38',
          pages: '156-178',
          doi: '10.1080/sbr.2022.03.012',
          quotes: [
            {
              text: 'Meta-analysis of 15 studies confirms the effectiveness of high-intensity resistance training for bone preservation in space.',
              page: 162,
              paragraph: 2
            }
          ],
          methodology: 'Systematic review and meta-analysis of 15 studies',
          confidence: 87
        }
      ],
      consensus: 'Strong consensus among 8 studies with 89% confidence',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'radiation-shielding-1',
      title: 'Radiation Shielding - Experimental',
      score: 28,
      status: 'experimental',
      sources: [
        {
          id: 'nasa-2023-078',
          title: 'Advanced Materials for Cosmic Radiation Protection',
          authors: ['Dr. Elena Petrov', 'Dr. James Thompson'],
          year: 2023,
          journal: 'Materials Science in Space',
          volume: '12',
          pages: '89-102',
          doi: '10.1016/j.mss.2023.07.008',
          quotes: [
            {
              text: 'Preliminary testing of graphene-based shielding shows 15% improvement over traditional aluminum shielding, but requires further validation.',
              page: 95,
              paragraph: 4
            }
          ],
          methodology: 'Laboratory testing with simulated cosmic radiation',
          confidence: 45
        }
      ],
      consensus: 'Limited data with mixed results, requiring more research',
      lastUpdated: '2024-01-10'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'mission-ready': return 'from-green-500 to-green-600';
      case 'promising': return 'from-yellow-500 to-yellow-600';
      case 'experimental': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'mission-ready': return 'Mission Ready';
      case 'promising': return 'Promising';
      case 'experimental': return 'Experimental';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`backdrop-blur-md border rounded-3xl p-8 shadow-lg transition-all duration-500 ${
      isDarkMode 
        ? 'bg-slate-800/50 border-slate-700/50' 
        : 'bg-white/80 border-slate-300/50'
    }`}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold mb-1 transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>Evidence Trail</h2>
          <p className={`text-sm transition-colors duration-500 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>Transparent source citations and research backing</p>
        </div>
      </div>

      <div className="space-y-4">
        {evidenceData.map((evidence) => (
            <div 
              key={evidence.id}
              className={`rounded-2xl border transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-slate-700/30 border-slate-600/50 hover:border-purple-500/30' 
                  : 'bg-slate-50/50 border-slate-200/50 hover:border-purple-500/30'
              }`}
            >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setSelectedEvidence(selectedEvidence === evidence.id ? null : evidence.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <FileText className="w-5 h-5 text-cyan-400 mr-2" />
                    <h3 className={`text-lg font-semibold transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>{evidence.title}</h3>
                    <div className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(evidence.status)} text-white`}>
                      {getStatusText(evidence.status)}
                    </div>
                  </div>
                  <div className={`flex items-center space-x-4 text-sm transition-colors ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <span>Score: {evidence.score}%</span>
                    <span>•</span>
                    <span>{evidence.consensus}</span>
                    <span>•</span>
                    <span>Updated: {evidence.lastUpdated}</span>
                  </div>
                </div>
                <div className="ml-4">
                  {selectedEvidence === evidence.id ? (
                    <ChevronUp className={`w-5 h-5 transition-colors ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 transition-colors ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                  )}
                </div>
              </div>
            </div>

            {selectedEvidence === evidence.id && (
              <div className="px-6 pb-6 border-t border-slate-700/50">
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                    <Quote className="w-4 h-4 mr-2" />
                    Source Evidence
                  </h4>
                  <div className="space-y-4">
                    {evidence.sources.map((source, index) => (
                      <div key={index} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h5 className="text-white font-medium mb-1">{source.title}</h5>
                            <div className="flex items-center space-x-4 text-xs text-slate-400 mb-2">
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {source.authors.join(', ')}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {source.year}
                              </span>
                              <span className="flex items-center">
                                <Hash className="w-3 h-3 mr-1" />
                                {source.confidence}% confidence
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-2">
                              {source.journal}, Vol. {source.volume}, pp. {source.pages}
                            </p>
                            <p className="text-xs text-slate-500 mb-3">
                              DOI: {source.doi}
                            </p>
                            <p className="text-xs text-slate-400 mb-3">
                              {source.methodology}
                            </p>
                          </div>
                          <button className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors flex items-center ml-4">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            View Paper
                          </button>
                        </div>

                        {/* Key Quotes */}
                        <div className="space-y-3">
                          <h6 className="text-xs font-semibold text-slate-300">Key Evidence:</h6>
                          {source.quotes.map((quote, quoteIndex) => (
                            <div key={quoteIndex} className="bg-slate-900/50 rounded-lg p-3 border-l-4 border-indigo-500/50">
                              <p className="text-sm text-slate-300 italic mb-1">"{quote.text}"</p>
                              <div className="flex items-center space-x-4 text-xs text-slate-500">
                                <span>Page {quote.page}, Paragraph {quote.paragraph}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-indigo-900/20 to-blue-900/20 rounded-xl border border-indigo-500/20">
                    <p className="text-sm text-indigo-300">
                      <strong>Evidence Summary:</strong> {evidence.consensus}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-900/20 to-blue-900/20 rounded-2xl border border-indigo-500/20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-indigo-300 font-medium">Full Transparency</p>
            <p className="text-xs text-slate-400">Every assessment is backed by verifiable research sources</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceTrail;
