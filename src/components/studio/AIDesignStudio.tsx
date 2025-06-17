import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Download, Share2, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { generateTattooDesign, InkArtResult } from '../../api/replicate';

const AIDesignStudio: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentDesign, setCurrentDesign] = useState<InkArtResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationParams, setGenerationParams] = useState({
    style: 'traditional',
    subject: 'dragon',
    placement: 'arm'
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      console.log('🎨 Starting AI design generation...');
      
      const result = await generateTattooDesign(
        generationParams.style,
        generationParams.subject,
        generationParams.placement
      );
      
      setCurrentDesign(result);
      console.log('✅ Design generated successfully:', result);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate design';
      setError(errorMessage);
      console.error('❌ Design generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!currentDesign) return;
    
    try {
      const response = await fetch(currentDesign.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `tattoo-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  const handleShare = async () => {
    if (!currentDesign) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My AI Tattoo Design',
          text: `Check out this AI-generated tattoo design: ${currentDesign.metadata.prompt}`,
          url: currentDesign.imageUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(currentDesign.imageUrl);
        alert('Design URL copied to clipboard!');
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <span>AI Generated Design</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Generation Parameters */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
            <select
              value={generationParams.style}
              onChange={(e) => setGenerationParams(prev => ({ ...prev, style: e.target.value }))}
              className="w-full p-2 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none text-sm"
            >
              <option value="traditional">Traditional</option>
              <option value="realistic">Realistic</option>
              <option value="geometric">Geometric</option>
              <option value="abstract">Abstract</option>
              <option value="minimalist">Minimalist</option>
              <option value="neo-traditional">Neo-Traditional</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              value={generationParams.subject}
              onChange={(e) => setGenerationParams(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., dragon, rose, skull"
              className="w-full p-2 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Placement</label>
            <select
              value={generationParams.placement}
              onChange={(e) => setGenerationParams(prev => ({ ...prev, placement: e.target.value }))}
              className="w-full p-2 bg-dark-700 text-white rounded-lg border border-gray-600 focus:border-primary-500 focus:outline-none text-sm"
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
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg"
        >
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm">{error}</span>
          </div>
        </motion.div>
      )}

      {/* Design Canvas */}
      <div className="relative aspect-square bg-dark-900 rounded-xl border border-gray-700 overflow-hidden mb-6">
        {isGenerating ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-400 mb-2">AI is generating your design...</p>
              <p className="text-gray-500 text-sm">This may take 30-60 seconds</p>
            </div>
          </div>
        ) : currentDesign ? (
          <div className="relative w-full h-full">
            <img
              src={currentDesign.imageUrl}
              alt="AI Generated Design"
              className="w-full h-full object-contain"
              onLoad={() => console.log('✅ Image loaded successfully')}
              onError={() => console.error('❌ Failed to load image')}
            />
            
            {/* Success Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-2 right-2 bg-accent-500 text-dark-900 p-2 rounded-full"
            >
              <CheckCircle className="h-4 w-4" />
            </motion.div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Click generate to create your design</p>
              <p className="text-sm mt-2 text-gray-600">Powered by SDXL Fresh Ink AI</p>
            </div>
          </div>
        )}

        {/* Processing Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-transparent to-accent-500/20 animate-pulse" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate Design'}
        </button>
        <button 
          onClick={handleDownload}
          disabled={!currentDesign}
          className="p-3 bg-dark-700 text-gray-300 rounded-xl hover:bg-dark-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-5 w-5" />
        </button>
        <button 
          onClick={handleShare}
          disabled={!currentDesign}
          className="p-3 bg-dark-700 text-gray-300 rounded-xl hover:bg-dark-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Design Info */}
      {currentDesign && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-dark-700/50 rounded-xl border border-gray-700"
        >
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-400">Style:</span>
            <span className="text-white capitalize">{generationParams.style}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-400">Subject:</span>
            <span className="text-white capitalize">{generationParams.subject}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-400">Placement:</span>
            <span className="text-white capitalize">{generationParams.placement}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Dimensions:</span>
            <span className="text-accent-500">
              {currentDesign.metadata.width} × {currentDesign.metadata.height}
            </span>
          </div>
          {currentDesign.savedPath && (
            <div className="flex justify-between items-center text-sm mt-2">
              <span className="text-gray-400">Saved:</span>
              <span className="text-accent-500 text-xs">{currentDesign.savedPath}</span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AIDesignStudio;