import React from 'react';
import { motion } from 'framer-motion';
import AIDesignStudio from '../components/studio/AIDesignStudio';
import DesignTools from '../components/studio/DesignTools';
import BodyPlacement from '../components/studio/BodyPlacement';

const Studio: React.FC = () => {
  return (
    <div className="pt-16 min-h-screen bg-dark-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            AI Design{' '}
            <span className="bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
              Studio
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Create your perfect tattoo design using our advanced AI technology. 
            Customize style, placement, and details in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Design Tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <DesignTools />
          </motion.div>

          {/* AI Studio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <AIDesignStudio />
          </motion.div>

          {/* Body Placement */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <BodyPlacement />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Studio;