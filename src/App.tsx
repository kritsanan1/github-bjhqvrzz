import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import SecurityNotice from './components/layout/SecurityNotice';
import Homepage from './pages/Homepage';
import Studio from './pages/Studio';
import Gallery from './pages/Gallery';
import Artists from './pages/Artists';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Success from './pages/Success';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import { usePageTracking, usePerformanceTracking } from './hooks/useAnalytics';
import { analytics } from './utils/analytics';

function AppContent() {
  // Initialize analytics tracking
  usePageTracking();
  usePerformanceTracking();

  useEffect(() => {
    // Track initial app load
    analytics.trackEvent('app_load', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform
    });

    // Track visibility changes
    const handleVisibilityChange = () => {
      analytics.trackEvent('visibility_change', {
        hidden: document.hidden,
        visibilityState: document.visibilityState
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      analytics.trackEvent('connection_info', {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt
      });
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-radial from-primary-500/5 via-transparent to-transparent pointer-events-none" />
      
      <SecurityNotice />
      <Navigation />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/studio" element={<Studio />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/success" element={<Success />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
        </Routes>
      </motion.main>
      
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;