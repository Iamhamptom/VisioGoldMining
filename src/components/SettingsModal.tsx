import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Database, Key, Monitor, Shield, Check, Eye, EyeOff } from 'lucide-react';

type TabId = 'appearance' | 'data' | 'notifications' | 'api' | 'security';

interface Settings {
  highFidelityGlobe: boolean;
  anthropicApiKey: string;
}

function loadSettings(): Settings {
  if (typeof window === 'undefined') return { highFidelityGlobe: true, anthropicApiKey: '' };
  try {
    const stored = localStorage.getItem('visiogold-settings');
    if (stored) return { ...{ highFidelityGlobe: true, anthropicApiKey: '' }, ...JSON.parse(stored) };
  } catch {}
  return { highFidelityGlobe: true, anthropicApiKey: '' };
}

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<TabId>('appearance');
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setSaved(false);
    }
  }, [isOpen]);

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'data', label: 'Data Sources', icon: Database },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    localStorage.setItem('visiogold-settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-light text-white flex items-center gap-3">
                <Monitor className="text-gold-400 icon-shine" strokeWidth={1} /> System Settings
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} strokeWidth={1} className="icon-shine" />
              </button>
            </div>

            <div className="p-6 flex gap-8 flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 flex flex-col gap-2 shrink-0">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === id
                        ? 'bg-white/5 text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={16} strokeWidth={1} className="icon-shine" /> {label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                {activeTab === 'appearance' && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Theme Preferences</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gold-400 bg-gold-400/5 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3">
                          <div className="w-full h-16 bg-black rounded-md border border-white/10 flex items-center justify-center">
                            <span className="text-gold-400 font-mono text-xs">Pitch Black</span>
                          </div>
                          <span className="text-sm text-gold-400 font-medium flex items-center gap-1.5">
                            <Check size={14} /> Dark Mode
                          </span>
                        </div>
                        <div className="border border-white/10 bg-white/5 rounded-xl p-4 cursor-not-allowed flex flex-col items-center gap-3 opacity-40">
                          <div className="w-full h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 font-mono text-xs">Light</span>
                          </div>
                          <span className="text-sm text-gray-400 font-medium">Coming Soon</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Map Rendering</h3>
                      <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                        <div>
                          <div className="text-sm text-white font-medium">High-Fidelity Globe</div>
                          <div className="text-xs text-gray-400">Enable WebGL 3D rendering for the interactive map.</div>
                        </div>
                        <button
                          onClick={() => setSettings(s => ({ ...s, highFidelityGlobe: !s.highFidelityGlobe }))}
                          className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${
                            settings.highFidelityGlobe ? 'bg-gold-400' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-black rounded-full transition-all ${
                            settings.highFidelityGlobe ? 'right-1' : 'left-1'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'data' && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Connected Data Sources</h3>
                    <div className="flex flex-col gap-3">
                      {[
                        { name: 'DRC Project Database', status: 'Connected', count: '12 projects', color: 'green' },
                        { name: 'GeoJSON Layers', status: 'Connected', count: '7 layers', color: 'green' },
                        { name: 'Province Intelligence', status: 'Connected', count: '9 provinces', color: 'green' },
                        { name: 'CAMI Cadastre API', status: 'Not configured', count: '', color: 'gray' },
                        { name: 'Sentinel-2 Imagery', status: 'Not configured', count: '', color: 'gray' },
                      ].map((src) => (
                        <div key={src.name} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${src.color === 'green' ? 'bg-green-400' : 'bg-gray-500'}`} />
                            <div>
                              <div className="text-sm text-white">{src.name}</div>
                              {src.count && <div className="text-xs text-gray-400">{src.count}</div>}
                            </div>
                          </div>
                          <span className={`text-xs font-mono ${src.color === 'green' ? 'text-green-400' : 'text-gray-500'}`}>
                            {src.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Notification Preferences</h3>
                    <div className="flex flex-col gap-3">
                      {[
                        { label: 'Permit Expiry Alerts', desc: 'Get notified when permits are nearing expiry', enabled: true },
                        { label: 'Security Event Updates', desc: 'Receive alerts for new security events in tracked regions', enabled: true },
                        { label: 'Simulation Complete', desc: 'Notify when Monte Carlo simulations finish', enabled: false },
                      ].map((n) => (
                        <div key={n.label} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5">
                          <div>
                            <div className="text-sm text-white">{n.label}</div>
                            <div className="text-xs text-gray-400">{n.desc}</div>
                          </div>
                          <div className={`w-10 h-6 rounded-full relative cursor-pointer ${n.enabled ? 'bg-gold-400' : 'bg-gray-600'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-black rounded-full ${n.enabled ? 'right-1' : 'left-1'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Full notification system coming soon. Alerts will be delivered in-app and via email.</p>
                  </div>
                )}

                {activeTab === 'api' && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">API Configuration</h3>
                    <div className="flex flex-col gap-4">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <label className="text-sm text-white font-medium block mb-2">Anthropic API Key</label>
                        <p className="text-xs text-gray-400 mb-3">Required for AI agent intelligence. Get your key from console.anthropic.com</p>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <input
                              type={showKey ? 'text' : 'password'}
                              value={settings.anthropicApiKey}
                              onChange={(e) => {
                                const nextSettings = { ...settings, anthropicApiKey: e.target.value };
                                setSettings(nextSettings);
                                localStorage.setItem('visiogold-settings', JSON.stringify(nextSettings));
                              }}
                              placeholder="sk-ant-..."
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-gold-400/50 font-mono"
                            />
                            <button
                              onClick={() => setShowKey(!showKey)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                            >
                              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                        {settings.anthropicApiKey && (
                          <p className="text-xs text-green-400 mt-2 flex items-center gap-1">
                            <Check size={12} /> API key configured
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Security Settings</h3>
                    <div className="flex flex-col gap-3">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-sm text-white">AES-256-GCM Encryption</span>
                        </div>
                        <p className="text-xs text-gray-400">All artifacts are encrypted at rest with envelope encryption.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-sm text-white">Row-Level Security (RLS)</span>
                        </div>
                        <p className="text-xs text-gray-400">PostgreSQL RLS policies enforce workspace isolation for all data.</p>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                          <span className="text-sm text-white">JWT Authentication</span>
                        </div>
                        <p className="text-xs text-gray-400">HS256 signed tokens with 15-minute expiry and automatic refresh.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/50">
              <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-lg text-sm font-medium bg-gold-400 text-black hover:bg-yellow-400 transition-colors flex items-center gap-2"
              >
                {saved ? <><Check size={14} /> Saved</> : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
