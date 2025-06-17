import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Download, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // In a real app, you might want to verify the session with your backend
      // For now, we'll just show a success message
      setTimeout(() => {
        setSessionData({ id: sessionId });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-dark-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full mb-8"
          >
            <CheckCircle className="h-12 w-12 text-dark-900" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Thank you for your purchase! Your credits have been added to your account and you're ready to start creating amazing AI-powered tattoo designs.
          </motion.p>

          {/* Session Info */}
          {sessionData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-2xl border border-gray-800 p-6 mb-8 max-w-md mx-auto"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Transaction Details</h3>
              <div className="text-sm text-gray-400">
                <p>Session ID: {sessionData.id}</p>
                <p>Status: Completed</p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/studio"
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200"
            >
              <Sparkles className="h-5 w-5" />
              <span>Start Creating</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/gallery"
              className="inline-flex items-center space-x-2 border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-primary-500 hover:bg-primary-500/10 transition-all duration-200"
            >
              <span>Browse Gallery</span>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Sparkles className="h-6 w-6 text-primary-400" />
              </div>
              <h4 className="text-white font-medium mb-2">AI Design Studio</h4>
              <p className="text-gray-400 text-sm">Create unlimited unique designs with our AI-powered tools</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Download className="h-6 w-6 text-accent-400" />
              </div>
              <h4 className="text-white font-medium mb-2">High-Quality Downloads</h4>
              <p className="text-gray-400 text-sm">Download your designs in high resolution for printing</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-purple-400" />
              </div>
              <h4 className="text-white font-medium mb-2">Expert Support</h4>
              <p className="text-gray-400 text-sm">Get help from our team of professional tattoo artists</p>
            </div>
          </motion.div>

          {/* Receipt */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-500 text-sm mb-2">
              A receipt has been sent to your email address.
            </p>
            <p className="text-gray-500 text-sm">
              Need help? Contact us at{' '}
              <a href="mailto:support@inkaistudio.com" className="text-primary-400 hover:text-primary-300">
                support@inkaistudio.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Success;