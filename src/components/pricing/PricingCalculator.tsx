import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, Palette } from 'lucide-react';

const PricingCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    size: 'medium',
    complexity: 'medium',
    color: 'blackgray',
    placement: 'arm',
    style: 'traditional',
    aiEnhancement: true,
    artistCollaboration: true,
  });

  const [estimate, setEstimate] = useState({
    total: 0,
    breakdown: {
      base: 0,
      complexity: 0,
      color: 0,
      aiEnhancement: 0,
      artistCollaboration: 0,
    },
    timeEstimate: '',
  });

  useEffect(() => {
    calculatePrice();
  }, [formData]);

  const calculatePrice = () => {
    let basePrice = 0;
    let complexityMultiplier = 1;
    let colorAddition = 0;
    let aiPrice = 0;
    let artistPrice = 0;
    let timeEstimate = '';

    // Base price by size
    switch (formData.size) {
      case 'small':
        basePrice = 150;
        timeEstimate = '2-3 hours';
        break;
      case 'medium':
        basePrice = 300;
        timeEstimate = '4-6 hours';
        break;
      case 'large':
        basePrice = 500;
        timeEstimate = '6-8 hours';
        break;
      case 'xlarge':
        basePrice = 800;
        timeEstimate = '8-12 hours';
        break;
    }

    // Complexity multiplier
    switch (formData.complexity) {
      case 'simple':
        complexityMultiplier = 0.8;
        break;
      case 'medium':
        complexityMultiplier = 1;
        break;
      case 'complex':
        complexityMultiplier = 1.5;
        break;
      case 'highly-detailed':
        complexityMultiplier = 2;
        break;
    }

    // Color addition
    if (formData.color === 'color') {
      colorAddition = basePrice * 0.3;
    }

    // AI Enhancement
    if (formData.aiEnhancement) {
      aiPrice = 99;
    }

    // Artist Collaboration
    if (formData.artistCollaboration) {
      artistPrice = 200;
    }

    const complexityPrice = basePrice * (complexityMultiplier - 1);
    const total = basePrice + complexityPrice + colorAddition + aiPrice + artistPrice;

    setEstimate({
      total: Math.round(total),
      breakdown: {
        base: basePrice,
        complexity: Math.round(complexityPrice),
        color: Math.round(colorAddition),
        aiEnhancement: aiPrice,
        artistCollaboration: artistPrice,
      },
      timeEstimate,
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid lg:grid-cols-2 gap-8"
    >
      {/* Calculator Form */}
      <div className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Calculator className="h-6 w-6 text-primary-500" />
          <span>Pricing Calculator</span>
        </h3>

        <div className="space-y-6">
          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Tattoo Size</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'small', label: 'Small (2-4")' },
                { value: 'medium', label: 'Medium (4-8")' },
                { value: 'large', label: 'Large (8-12")' },
                { value: 'xlarge', label: 'X-Large (12"+)' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('size', option.value)}
                  className={`p-3 text-sm rounded-lg transition-colors ${
                    formData.size === option.value
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Design Complexity</label>
            <select
              value={formData.complexity}
              onChange={(e) => handleInputChange('complexity', e.target.value)}
              className="w-full p-3 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            >
              <option value="simple">Simple - Basic shapes, minimal detail</option>
              <option value="medium">Medium - Moderate detail, some shading</option>
              <option value="complex">Complex - High detail, intricate design</option>
              <option value="highly-detailed">Highly Detailed - Photorealistic, maximum detail</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Color Options</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleInputChange('color', 'blackgray')}
                className={`flex-1 p-3 text-sm rounded-lg transition-colors ${
                  formData.color === 'blackgray'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                Black & Gray
              </button>
              <button
                onClick={() => handleInputChange('color', 'color')}
                className={`flex-1 p-3 text-sm rounded-lg transition-colors ${
                  formData.color === 'color'
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                Full Color
              </button>
            </div>
          </div>

          {/* Placement */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Body Placement</label>
            <select
              value={formData.placement}
              onChange={(e) => handleInputChange('placement', e.target.value)}
              className="w-full p-3 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            >
              <option value="arm">Arm</option>
              <option value="shoulder">Shoulder</option>
              <option value="back">Back</option>
              <option value="chest">Chest</option>
              <option value="leg">Leg</option>
              <option value="wrist">Wrist</option>
              <option value="neck">Neck</option>
              <option value="ankle">Ankle</option>
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Tattoo Style</label>
            <select
              value={formData.style}
              onChange={(e) => handleInputChange('style', e.target.value)}
              className="w-full p-3 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none"
            >
              <option value="traditional">Traditional</option>
              <option value="realistic">Realistic</option>
              <option value="geometric">Geometric</option>
              <option value="abstract">Abstract</option>
              <option value="minimalist">Minimalist</option>
              <option value="neo-traditional">Neo-Traditional</option>
            </select>
          </div>

          {/* Add-ons */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">Add-on Services</label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.aiEnhancement}
                onChange={(e) => handleInputChange('aiEnhancement', e.target.checked)}
                className="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 rounded focus:ring-primary-500"
              />
              <span className="text-gray-300">AI Design Enhancement (+$99)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.artistCollaboration}
                onChange={(e) => handleInputChange('artistCollaboration', e.target.checked)}
                className="w-4 h-4 text-primary-500 bg-dark-700 border-gray-600 rounded focus:ring-primary-500"
              />
              <span className="text-gray-300">Artist Collaboration (+$200)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <DollarSign className="h-6 w-6 text-accent-500" />
          <span>Price Breakdown</span>
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b border-gray-700">
            <span className="text-gray-300">Base Price ({formData.size})</span>
            <span className="text-white font-medium">${estimate.breakdown.base}</span>
          </div>

          {estimate.breakdown.complexity > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Complexity Adjustment</span>
              <span className="text-white font-medium">+${estimate.breakdown.complexity}</span>
            </div>
          )}

          {estimate.breakdown.color > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Color Addition</span>
              <span className="text-white font-medium">+${estimate.breakdown.color}</span>
            </div>
          )}

          {estimate.breakdown.aiEnhancement > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">AI Enhancement</span>
              <span className="text-white font-medium">+${estimate.breakdown.aiEnhancement}</span>
            </div>
          )}

          {estimate.breakdown.artistCollaboration > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-300">Artist Collaboration</span>
              <span className="text-white font-medium">+${estimate.breakdown.artistCollaboration}</span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold text-white">Total Estimate</span>
            <span className="text-3xl font-bold text-primary-400">${estimate.total}</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-300">
            <Clock className="h-5 w-5 text-primary-500" />
            <span>Estimated Time: {estimate.timeEstimate}</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-300">
            <Palette className="h-5 w-5 text-accent-500" />
            <span>Style: {formData.style.charAt(0).toUpperCase() + formData.style.slice(1)}</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 space-y-3">
          <button className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200">
            Book Consultation
          </button>
          <button className="w-full border border-gray-600 text-white py-3 px-6 rounded-xl font-medium hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-200">
            Save Estimate
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          *Final pricing may vary based on consultation and specific requirements
        </p>
      </div>
    </motion.div>
  );
};

export default PricingCalculator;