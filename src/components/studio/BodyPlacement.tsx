import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Eye, RotateCcw } from 'lucide-react';

const BodyPlacement: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');

  const bodyAreas = {
    front: [
      { id: 'chest', name: 'Chest', x: 50, y: 30 },
      { id: 'left-arm', name: 'Left Arm', x: 25, y: 40 },
      { id: 'right-arm', name: 'Right Arm', x: 75, y: 40 },
      { id: 'stomach', name: 'Stomach', x: 50, y: 50 },
      { id: 'left-leg', name: 'Left Leg', x: 40, y: 75 },
      { id: 'right-leg', name: 'Right Leg', x: 60, y: 75 },
    ],
    back: [
      { id: 'upper-back', name: 'Upper Back', x: 50, y: 25 },
      { id: 'lower-back', name: 'Lower Back', x: 50, y: 45 },
      { id: 'left-shoulder', name: 'Left Shoulder', x: 25, y: 30 },
      { id: 'right-shoulder', name: 'Right Shoulder', x: 75, y: 30 },
    ],
  };

  return (
    <div className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <User className="h-5 w-5 text-primary-500" />
          <span>Body Placement</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'front' ? 'back' : 'front')}
            className="p-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Body Diagram */}
      <div className="relative aspect-[3/4] bg-dark-900 rounded-xl border border-gray-700 overflow-hidden mb-6">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Body Outline */}
          <path
            d={viewMode === 'front' 
              ? "M50 10 C45 10 40 15 40 20 L40 25 C35 25 30 30 30 35 L30 60 C30 65 35 70 40 70 L40 85 C40 90 45 95 50 95 C55 95 60 90 60 85 L60 70 C65 70 70 65 70 60 L70 35 C70 30 65 25 60 25 L60 20 C60 15 55 10 50 10 Z"
              : "M50 10 C45 10 40 15 40 20 L40 25 C35 25 30 30 30 35 L30 60 C30 65 35 70 40 70 L40 85 C40 90 45 95 50 95 C55 95 60 90 60 85 L60 70 C65 70 70 65 70 60 L70 35 C70 30 65 25 60 25 L60 20 C60 15 55 10 50 10 Z"
            }
            fill="rgba(75, 85, 99, 0.3)"
            stroke="rgba(75, 85, 99, 0.6)"
            strokeWidth="0.5"
          />

          {/* Interactive Areas */}
          {bodyAreas[viewMode].map((area) => (
            <g key={area.id}>
              <circle
                cx={area.x}
                cy={area.y}
                r="4"
                fill={selectedArea === area.id ? '#00d4ff' : 'rgba(0, 212, 255, 0.6)'}
                stroke={selectedArea === area.id ? '#39ff14' : '#00d4ff'}
                strokeWidth="1"
                className="cursor-pointer transition-all duration-200 hover:r-5"
                onClick={() => setSelectedArea(area.id)}
              />
              {selectedArea === area.id && (
                <motion.circle
                  cx={area.x}
                  cy={area.y}
                  r="6"
                  fill="none"
                  stroke="#39ff14"
                  strokeWidth="1"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="animate-pulse"
                />
              )}
            </g>
          ))}
        </svg>

        {/* View Label */}
        <div className="absolute top-2 left-2 bg-dark-800/80 text-white text-xs px-2 py-1 rounded">
          {viewMode === 'front' ? 'Front View' : 'Back View'}
        </div>
      </div>

      {/* Selected Area Info */}
      {selectedArea && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-dark-700/50 rounded-xl border border-gray-700 mb-4"
        >
          <h4 className="text-white font-medium mb-2">
            {bodyAreas[viewMode].find(area => area.id === selectedArea)?.name}
          </h4>
          <div className="text-sm text-gray-400 space-y-1">
            <p>Pain Level: Medium</p>
            <p>Healing Time: 2-3 weeks</p>
            <p>Visibility: High</p>
          </div>
        </motion.div>
      )}

      {/* Size Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-300">Size Preview</label>
        <div className="flex space-x-2">
          {['Small', 'Medium', 'Large'].map((size) => (
            <button
              key={size}
              className="flex-1 p-2 text-xs bg-dark-700 text-gray-300 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BodyPlacement;