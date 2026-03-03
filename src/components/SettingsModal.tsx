import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Database, Key, Monitor, Shield } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-light text-white flex items-center gap-3">
                <Monitor className="text-gold-400 icon-shine" strokeWidth={1} /> System Settings
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} strokeWidth={1} className="icon-shine" />
              </button>
            </div>

            <div className="p-6 flex gap-8">
              {/* Sidebar */}
              <div className="w-48 flex flex-col gap-2">
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/5 text-white text-sm font-medium">
                  <Monitor size={16} strokeWidth={1} className="icon-shine" /> Appearance
                </button>
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">
                  <Database size={16} strokeWidth={1} className="icon-shine" /> Data Sources
                </button>
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">
                  <Bell size={16} strokeWidth={1} className="icon-shine" /> Notifications
                </button>
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">
                  <Key size={16} strokeWidth={1} className="icon-shine" /> API Keys
                </button>
                <button className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors">
                  <Shield size={16} strokeWidth={1} className="icon-shine" /> Security
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Theme Preferences</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gold-400 bg-gold-400/5 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3">
                      <div className="w-full h-16 bg-black rounded-md border border-white/10 flex items-center justify-center">
                        <span className="text-gold-400 font-mono text-xs">Pitch Black</span>
                      </div>
                      <span className="text-sm text-gold-400 font-medium">Dark Mode (Active)</span>
                    </div>
                    <div className="border border-white/10 bg-white/5 rounded-xl p-4 cursor-pointer flex flex-col items-center gap-3 opacity-50">
                      <div className="w-full h-16 bg-white rounded-md border border-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 font-mono text-xs">Light</span>
                      </div>
                      <span className="text-sm text-gray-400 font-medium">Light Mode</span>
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
                    <div className="w-10 h-6 bg-gold-400 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-black/50">
              <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button onClick={onClose} className="px-5 py-2 rounded-lg text-sm font-medium bg-gold-400 text-black hover:bg-yellow-400 transition-colors">
                Save Changes
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
