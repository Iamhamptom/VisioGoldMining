import React from 'react';
import { Globe, Compass, FileSearch, HardHat, LineChart, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { ScreenType } from '@/lib/types/screen';

interface SidebarProps {
  activeScreen: ScreenType;
  setActiveScreen: (screen: ScreenType) => void;
  onOpenSettings: () => void;
}

export default function Sidebar({ activeScreen, setActiveScreen, onOpenSettings }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Globe, label: 'Globe Home' },
    { id: 'explorer', icon: Compass, label: 'Opportunity Explorer' },
    { id: 'evaluator', icon: FileSearch, label: 'Project Evaluator' },
    { id: 'builder', icon: HardHat, label: 'Project Builder' },
    { id: 'simulation', icon: LineChart, label: 'Simulation Studio' },
  ];

  return (
    <div className="w-20 h-full border-r border-white/10 bg-black/80 backdrop-blur-xl flex flex-col items-center py-8 gap-8 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
      <motion.div 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 relative flex items-center justify-center group cursor-pointer mb-6"
      >
        <div className="absolute inset-0 border border-gold/50 rotate-45 group-hover:rotate-90 transition-transform duration-700 gold-glow bg-gold/5"></div>
        <div className="absolute inset-2 border border-gold/20 rotate-45 group-hover:-rotate-45 transition-transform duration-700"></div>
        <span className="text-gold font-display font-bold text-lg tracking-tighter relative z-10 icon-shine">VG</span>
      </motion.div>
      
      <div className="flex flex-col gap-6 w-full items-center flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveScreen(item.id as ScreenType)}
              className={`p-3.5 rounded-2xl transition-all duration-300 relative group ${
                isActive ? 'bg-gold/20 text-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
              title={item.label}
            >
              <Icon size={24} strokeWidth={1} className={`icon-shine ${isActive ? 'text-gold' : ''}`} />
              {isActive && (
                <motion.div 
                  layoutId="activeIndicator"
                  className="absolute -left-5 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gold rounded-r-full" 
                />
              )}
              
              {/* Tooltip */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black border border-white/10 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                {item.label}
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenSettings}
        className="p-3.5 rounded-2xl text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-300 relative group mt-auto"
      >
        <Settings size={24} strokeWidth={1} className="icon-shine" />
        <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-black border border-white/10 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
          Settings
        </div>
      </motion.button>
    </div>
  );
}
