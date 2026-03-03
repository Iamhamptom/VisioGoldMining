import { AnimatePresence, motion } from 'motion/react';
import { ScreenType } from '@/lib/types/screen';
import GlobeHome from './screens/GlobeHome';
import OpportunityExplorer from './screens/OpportunityExplorer';
import ProjectEvaluator from './screens/ProjectEvaluator';
import ProjectBuilder from './screens/ProjectBuilder';
import SimulationStudio from './screens/SimulationStudio';
import ProjectPursuit from './screens/ProjectPursuit';
import AgentCommandCenter from './screens/AgentCommandCenter';
import FeatureContextPanel from './panels/FeatureContextPanel';
import RepoMapPanel from './repos/RepoMapPanel';

interface Props {
  activeScreen: ScreenType;
  selectedRepo?: string | null;
  setActiveScreen?: (screen: ScreenType) => void;
  setSelectedRepo?: (id: string | null) => void;
}

export default function RightPanel({ activeScreen, selectedRepo, setActiveScreen, setSelectedRepo }: Props) {
  const variants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="h-full w-full overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeScreen}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0 overflow-y-auto overflow-x-hidden"
        >
          {activeScreen === 'home' && <GlobeHome />}
          {activeScreen === 'explorer' && (
            <OpportunityExplorer
              onCreateRepo={(repoId) => {
                setSelectedRepo?.(repoId);
                setActiveScreen?.('repo');
              }}
              onEvaluate={() => setActiveScreen?.('evaluator')}
            />
          )}
          {activeScreen === 'evaluator' && <ProjectEvaluator />}
          {activeScreen === 'builder' && <ProjectBuilder />}
          {activeScreen === 'simulation' && <SimulationStudio />}
          {activeScreen === 'pursuit' && <ProjectPursuit />}
          {activeScreen === 'agents' && <AgentCommandCenter />}
          {activeScreen === 'feature' && <FeatureContextPanel />}
          {activeScreen === 'repo' && selectedRepo && <RepoMapPanel repoId={selectedRepo} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
