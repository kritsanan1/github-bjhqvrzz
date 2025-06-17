import React from 'react';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityBadgeProps {
  type: 'secure' | 'protected' | 'verified' | 'warning';
  text: string;
  className?: string;
}

const SecurityBadge: React.FC<SecurityBadgeProps> = ({ type, text, className = '' }) => {
  const configs = {
    secure: {
      icon: Shield,
      colors: 'bg-green-500/20 text-green-400 border-green-500/50',
      iconColor: 'text-green-400'
    },
    protected: {
      icon: Lock,
      colors: 'bg-primary-500/20 text-primary-400 border-primary-500/50',
      iconColor: 'text-primary-400'
    },
    verified: {
      icon: Eye,
      colors: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      iconColor: 'text-blue-400'
    },
    warning: {
      icon: AlertTriangle,
      colors: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      iconColor: 'text-yellow-400'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-medium ${config.colors} ${className}`}
    >
      <Icon className={`h-3 w-3 ${config.iconColor}`} />
      <span>{text}</span>
    </motion.div>
  );
};

export default SecurityBadge;