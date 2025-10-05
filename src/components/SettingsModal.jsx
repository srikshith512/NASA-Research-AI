import React, { useState } from 'react';
import { X, Settings, Moon, Sun, Volume2, VolumeX, Bell, BellOff, Shield, Database, User } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    soundEffects: true,
    dataPrivacy: 'high',
    researchMode: 'comprehensive'
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 via-indigo-900 to-slate-800 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-indigo-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                {settings.theme === 'dark' ? <Moon className="w-4 h-4 text-white" /> : <Sun className="w-4 h-4 text-white" />}
              </div>
              <h3 className="text-lg font-semibold text-white">Appearance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Theme</span>
                <div className="flex bg-slate-700 rounded-lg p-1">
                  <button
                    onClick={() => handleSettingChange('theme', 'light')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      settings.theme === 'light' 
                        ? 'bg-indigo-500 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => handleSettingChange('theme', 'dark')}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      settings.theme === 'dark' 
                        ? 'bg-indigo-500 text-white' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                {settings.notifications ? <Bell className="w-4 h-4 text-white" /> : <BellOff className="w-4 h-4 text-white" />}
              </div>
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Research Updates</span>
                <button
                  onClick={() => handleSettingChange('notifications', !settings.notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.notifications ? 'bg-indigo-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Sound Effects</span>
                <button
                  onClick={() => handleSettingChange('soundEffects', !settings.soundEffects)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.soundEffects ? 'bg-indigo-500' : 'bg-slate-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.soundEffects ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Privacy & Security</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Data Privacy Level</span>
                <select
                  value={settings.dataPrivacy}
                  onChange={(e) => handleSettingChange('dataPrivacy', e.target.value)}
                  className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Research Mode</span>
                <select
                  value={settings.researchMode}
                  onChange={(e) => handleSettingChange('researchMode', e.target.value)}
                  className="bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600"
                >
                  <option value="comprehensive">Comprehensive</option>
                  <option value="focused">Focused</option>
                  <option value="basic">Basic</option>
                </select>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Database className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Data Management</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200">
                Export Research Data
              </button>
              <button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200">
                Clear Chat History
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
