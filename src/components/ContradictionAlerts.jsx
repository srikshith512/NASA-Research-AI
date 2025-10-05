import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Users, Calendar } from 'lucide-react';

const ContradictionAlerts = ({ isDarkMode = true }) => {
  const [expandedAlert, setExpandedAlert] = useState(null);

  const contradictions = [
    {
      id: 'cardiovascular-exercise',
      topic: 'Cardiovascular Health',
      severity: 'high',
      studies: [
        {
          author: 'Smith et al.',
          year: 2021,
          finding: 'Exercise regimen Z shows 40% improvement in heart muscle strength',
          methodology: '6-month ISS study with 12 astronauts',
          confidence: 85
        },
        {
          author: 'Jones et al.',
          year: 2023,
          finding: 'Exercise regimen Z shows no significant improvement in cardiovascular function',
          methodology: '12-month ground-based simulation with 24 participants',
          confidence: 78
        }
      ],
      description: 'Conflicting results on the effectiveness of exercise regimen Z for mitigating heart muscle atrophy',
      impact: 'High - affects mission planning for long-duration spaceflight'
    },
    {
      id: 'bone-density-supplements',
      topic: 'Bone Density Supplements',
      severity: 'medium',
      studies: [
        {
          author: 'Chen et al.',
          year: 2022,
          finding: 'Calcium supplements reduce bone loss by 25% in microgravity',
          methodology: 'Double-blind study with 18 astronauts',
          confidence: 92
        },
        {
          author: 'Williams et al.',
          year: 2023,
          finding: 'Calcium supplements show minimal effect on bone density preservation',
          methodology: 'Meta-analysis of 15 studies',
          confidence: 81
        }
      ],
      description: 'Disagreement on the efficacy of calcium supplementation for bone health in space',
      impact: 'Medium - affects nutritional protocols for space missions'
    },
    {
      id: 'radiation-tolerance',
      topic: 'Radiation Tolerance',
      severity: 'high',
      studies: [
        {
          author: 'NASA Research Team',
          year: 2022,
          finding: 'Current shielding provides adequate protection for Mars missions',
          methodology: 'Computer modeling and ground-based testing',
          confidence: 88
        },
        {
          author: 'European Space Agency',
          year: 2023,
          finding: 'Additional shielding required for safe Mars mission duration',
          methodology: 'Radiation exposure modeling with updated solar activity data',
          confidence: 91
        }
      ],
      description: 'Conflicting assessments on radiation protection requirements for Mars missions',
      impact: 'Critical - affects mission safety and spacecraft design'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-yellow-600';
      case 'low': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
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
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold mb-1 transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>Contradiction Alerts</h2>
          <p className={`text-sm transition-colors duration-500 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>Scientific disagreements requiring attention</p>
        </div>
      </div>

      <div className="space-y-4">
        {contradictions.map((contradiction) => (
          <div 
            key={contradiction.id}
            className={`rounded-2xl border transition-all duration-300 ${
              isDarkMode 
                ? 'bg-slate-700/30 border-slate-600/50 hover:border-red-500/30' 
                : 'bg-slate-50/50 border-slate-200/50 hover:border-red-500/30'
            }`}
          >
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedAlert(expandedAlert === contradiction.id ? null : contradiction.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                    <h3 className={`text-lg font-semibold transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>{contradiction.topic}</h3>
                    <div className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getSeverityColor(contradiction.severity)} text-white`}>
                      {getSeverityText(contradiction.severity)}
                    </div>
                  </div>
                  <p className={`text-sm mb-3 transition-colors ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>{contradiction.description}</p>
                  <p className={`text-xs transition-colors ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>Impact: {contradiction.impact}</p>
                </div>
                <div className="ml-4">
                  {expandedAlert === contradiction.id ? (
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

            {expandedAlert === contradiction.id && (
              <div className="px-6 pb-6 border-t border-slate-700/50">
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Conflicting Studies
                  </h4>
                  <div className="space-y-4">
                    {contradiction.studies.map((study, index) => (
                      <div key={index} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                            <span className="text-sm font-medium text-white">{study.author}</span>
                            <span className="text-slate-400 text-sm ml-2">({study.year})</span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {study.confidence}% confidence
                          </div>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{study.finding}</p>
                        <p className="text-slate-400 text-xs">{study.methodology}</p>
                        <button className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs font-medium transition-colors flex items-center">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Full Study
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl border border-red-500/20">
                    <p className="text-sm text-red-300">
                      <strong>Recommendation:</strong> Additional research needed to resolve this contradiction before mission planning.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-2xl border border-red-500/20">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-red-300 font-medium">Active Monitoring</p>
            <p className="text-xs text-slate-400">Contradictions are tracked and updated as new research emerges</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContradictionAlerts;
