import { motion } from 'motion/react';
import { Eye, BarChart3, Map, Search, FileText, MessageSquare } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';
import type { DeepDiveTab } from '@/lib/types/deep-dive';

const TABS: { id: DeepDiveTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'scores', label: 'Scores', icon: BarChart3 },
  { id: 'map', label: 'Map', icon: Map },
  { id: 'research', label: 'Research', icon: Search },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'ask-ai', label: 'Ask AI', icon: MessageSquare },
];

export default function DeepDiveTabBar() {
  const { activeTab, setActiveTab } = useDeepDive();

  return (
    <div className="flex items-center gap-1 px-6 border-b border-white/10 bg-black/20 shrink-0">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-3 text-xs font-medium transition-colors ${
              isActive ? 'text-gold-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon size={14} strokeWidth={1.5} />
            {tab.label}
            {isActive && (
              <motion.div
                layoutId="deepDiveTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-400 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
