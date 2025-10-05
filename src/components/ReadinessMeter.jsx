import React from 'react';
import { Shield, Leaf, Activity, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const ReadinessMeter = ({ isDarkMode = true }) => {
  const challenges = [
    {
      id: 'radiation-shielding',
      title: 'Radiation Shielding',
      status: 'experimental', // experimental, promising, mission-ready
      confidence: 35,
      description: 'Advanced materials for cosmic radiation protection',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'food-production',
      title: 'Food Production',
      status: 'promising',
      confidence: 72,
      description: 'Sustainable agriculture systems for space habitats',
      icon: Leaf,
      color: 'yellow'
    },
    {
      id: 'bone-density',
      title: 'Bone Density Countermeasures',
      status: 'mission-ready',
      confidence: 89,
      description: 'Exercise regimens to prevent bone loss in microgravity',
      icon: Activity,
      color: 'green'
    },
    {
      id: 'energy-systems',
      title: 'Energy Systems',
      status: 'experimental',
      confidence: 28,
      description: 'Solar and nuclear power for deep space missions',
      icon: Zap,
      color: 'red'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'experimental': return 'from-red-500 to-red-600';
      case 'promising': return 'from-yellow-500 to-yellow-600';
      case 'mission-ready': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'experimental': return AlertTriangle;
      case 'promising': return AlertTriangle;
      case 'mission-ready': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'experimental': return 'Experimental';
      case 'promising': return 'Promising';
      case 'mission-ready': return 'Mission-Ready';
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
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`text-2xl font-bold mb-1 transition-colors duration-500 ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>Readiness Meter</h2>
          <p className={`text-sm transition-colors duration-500 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>Critical exploration challenges assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const Icon = challenge.icon;
          const StatusIcon = getStatusIcon(challenge.status);
          
          return (
            <div 
              key={challenge.id}
              className={`rounded-2xl p-6 border transition-all duration-300 cursor-pointer group ${
                isDarkMode 
                  ? 'bg-slate-700/30 border-slate-600/50 hover:border-purple-500/30' 
                  : 'bg-slate-50/50 border-slate-200/50 hover:border-purple-500/30'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-semibold group-hover:text-purple-400 transition-colors ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {challenge.title}
                    </h3>
                    <p className={`text-sm transition-colors ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>{challenge.description}</p>
                  </div>
                </div>
                <StatusIcon className={`w-6 h-6 ${
                  challenge.status === 'experimental' ? 'text-red-400' :
                  challenge.status === 'promising' ? 'text-yellow-400' :
                  'text-green-400'
                }`} />
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm transition-colors ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>Confidence Level</span>
                  <span className={`text-sm font-semibold transition-colors ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>{challenge.confidence}%</span>
                </div>
                <div className={`w-full rounded-full h-2 transition-colors ${
                  isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                }`}>
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(challenge.status)} transition-all duration-500`}
                    style={{ width: `${challenge.confidence}%` }}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(challenge.status)} text-white`}>
                  {getStatusText(challenge.status)}
                </div>
                <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                  View Evidence →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-6 p-4 rounded-2xl border transition-all duration-500 ${
        isDarkMode 
          ? 'bg-slate-700/30 border-slate-600/50' 
          : 'bg-slate-100/50 border-slate-200/50'
      }`}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className={`text-sm font-medium transition-colors ${
              isDarkMode ? 'text-purple-300' : 'text-purple-600'
            }`}>Real-time Assessment</p>
            <p className={`text-xs transition-colors ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>Scores updated based on latest research consensus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadinessMeter;
