import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Sliders, Type, Layers } from 'lucide-react';

const DesignTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('style');

  const tabs = [
    { id: 'style', label: 'Style', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Sliders },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'layers', label: 'Layers', icon: Layers },
  ];

  const styles = [
    'Traditional', 'Realistic', 'Geometric', 'Abstract', 'Minimalist', 'Neo-Traditional'
  ];

  const placements = [
    'Arm', 'Shoulder', 'Back', 'Chest', 'Leg', 'Wrist', 'Neck', 'Ankle'
  ];

  return (
    <div className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-white mb-6">Design Tools</h3>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-dark-900/50 rounded-lg p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium hidden sm:block">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeTab === 'style' && (
          <div className="space-y-6">
            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Tattoo Style</label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    className="p-3 text-sm bg-dark-700 text-gray-300 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Placement */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Body Placement</label>
              <div className="grid grid-cols-2 gap-2">
                {placements.map((placement) => (
                  <button
                    key={placement}
                    className="p-3 text-sm bg-dark-700 text-gray-300 rounded-lg hover:bg-primary-500 hover:text-white transition-colors"
                  >
                    {placement}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Size Slider */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Size</label>
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="5"
                className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Complexity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Complexity</label>
              <select className="w-full p-3 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none">
                <option>Simple</option>
                <option>Medium</option>
                <option>Complex</option>
                <option>Highly Detailed</option>
              </select>
            </div>

            {/* Color Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Color</label>
              <div className="flex space-x-2">
                <button className="flex-1 p-3 bg-dark-700 text-gray-300 rounded-lg hover:bg-primary-500 hover:text-white transition-colors">
                  Black & Gray
                </button>
                <button className="flex-1 p-3 bg-dark-700 text-gray-300 rounded-lg hover:bg-primary-500 hover:text-white transition-colors">
                  Full Color
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Add Text</label>
              <textarea
                placeholder="Enter your text here..."
                className="w-full p-3 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            {/* Font Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Font Style</label>
              <select className="w-full p-3 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none">
                <option>Script</option>
                <option>Gothic</option>
                <option>Modern</option>
                <option>Classic</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <span className="text-white">Background</span>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-white">
                  <Layers className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <span className="text-white">Main Design</span>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-white">
                  <Layers className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <span className="text-white">Details</span>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-400 hover:text-white">
                  <Layers className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DesignTools;