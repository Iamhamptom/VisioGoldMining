import { motion, AnimatePresence } from 'motion/react';
import { useDeepDive } from '@/hooks/useDeepDive';
import DeepDiveHeader from './DeepDiveHeader';
import DeepDiveTabBar from './DeepDiveTabBar';
import OverviewTab from './tabs/OverviewTab';
import ScoresTab from './tabs/ScoresTab';
import MapTab from './tabs/MapTab';
import ResearchTab from './tabs/ResearchTab';
import DocumentsTab from './tabs/DocumentsTab';
import AskAITab from './tabs/AskAITab';

export default function DeepDiveModal() {
  const { isOpen, activeTab, closeDeepDive } = useDeepDive();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDeepDive}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <DeepDiveHeader />
            <DeepDiveTabBar />

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="h-full"
                >
                  {activeTab === 'overview' && <OverviewTab />}
                  {activeTab === 'scores' && <ScoresTab />}
                  {activeTab === 'map' && <MapTab />}
                  {activeTab === 'research' && <ResearchTab />}
                  {activeTab === 'documents' && <DocumentsTab />}
                  {activeTab === 'ask-ai' && <AskAITab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
