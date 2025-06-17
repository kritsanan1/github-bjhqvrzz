import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, X, Lock, Eye, AlertTriangle } from 'lucide-react';

const SecurityNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border-b border-primary-500/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary-400" />
                <span className="text-sm font-medium text-white">Secure Platform</span>
              </div>
              
              <div className="hidden sm:flex items-center space-x-6 text-xs text-gray-300">
                <div className="flex items-center space-x-1">
                  <Lock className="h-3 w-3 text-green-400" />
                  <span>End-to-End Encryption</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3 text-blue-400" />
                  <span>Privacy Protected</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3 text-yellow-400" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SecurityNotice;