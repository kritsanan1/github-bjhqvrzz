import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Palette } from 'lucide-react';

const AIVisualization: React.FC = () => {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 6);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { x: 50, y: 20, icon: Brain, label: 'AI Processing' },
    { x: 80, y: 40, icon: Sparkles, label: 'Style Analysis' },
    { x: 70, y: 70, icon: Palette, label: 'Color Mapping' },
    { x: 30, y: 80, icon: Brain, label: 'Design Generation' },
    { x: 10, y: 60, icon: Sparkles, label: 'Pattern Recognition' },
    { x: 20, y: 30, icon: Palette, label: 'Artistic Fusion' },
  ];

  return (
    <div className="relative w-full h-96 lg:h-[500px]">
      {/* Main Container */}
      <div className="relative w-full h-full bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-3xl backdrop-blur-sm border border-gray-800 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Connections */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          {nodes.map((node, index) => {
            const nextNode = nodes[(index + 1) % nodes.length];
            return (
              <motion.line
                key={index}
                x1={node.x}
                y1={node.y}
                x2={nextNode.x}
                y2={nextNode.y}
                stroke="#00d4ff"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                  pathLength: 1, 
                  opacity: activeNode === index ? 0.8 : 0.3 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, index) => {
          const Icon = node.icon;
          return (
            <motion.div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <motion.div
                className={`relative p-3 rounded-full border-2 backdrop-blur-sm ${
                  activeNode === index
                    ? 'bg-primary-500/20 border-primary-500 shadow-lg shadow-primary-500/25'
                    : 'bg-gray-800/50 border-gray-600'
                }`}
                animate={{
                  scale: activeNode === index ? 1.2 : 1,
                  rotate: activeNode === index ? 360 : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                <Icon 
                  className={`h-6 w-6 ${
                    activeNode === index ? 'text-primary-400' : 'text-gray-400'
                  }`} 
                />
                {activeNode === index && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary-500"
                    animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
              
              {/* Label */}
              <motion.div
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: activeNode === index ? 1 : 0,
                  y: activeNode === index ? 0 : 10
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xs text-primary-400 font-medium bg-dark-800/80 px-2 py-1 rounded">
                  {node.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Central Glow Effect */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
          animate={{
            background: [
              'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(57,255,20,0.1) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Floating Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-500 rounded-full"
            animate={{
              x: [0, Math.random() * 400 - 200],
              y: [0, Math.random() * 400 - 200],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>

      {/* Status Display */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 bg-dark-800/80 rounded-lg p-3 backdrop-blur-sm border border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">AI Status:</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
            <span className="text-accent-500 font-medium">Processing Design</span>
          </div>
        </div>
        <div className="mt-2 bg-gray-700 rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
            animate={{ width: ['0%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AIVisualization;