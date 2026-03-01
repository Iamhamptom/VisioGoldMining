import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenType } from '../App';
import GlobeHome from './screens/GlobeHome';
import OpportunityExplorer from './screens/OpportunityExplorer';
import ProjectEvaluator from './screens/ProjectEvaluator';
import ProjectBuilder from './screens/ProjectBuilder';
import SimulationStudio from './screens/SimulationStudio';

export default function RightPanel({ activeScreen }: { activeScreen: ScreenType }) {
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
          {activeScreen === 'explorer' && <OpportunityExplorer />}
          {activeScreen === 'evaluator' && <ProjectEvaluator />}
          {activeScreen === 'builder' && <ProjectBuilder />}
          {activeScreen === 'simulation' && <SimulationStudio />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
