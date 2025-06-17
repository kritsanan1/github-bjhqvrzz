import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Clock, Smartphone, Monitor, Tablet, TrendingUp, AlertTriangle } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface AnalyticsData {
  totalSessions: number;
  uniqueUsers: number;
  avgSessionDuration: number;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  performanceMetrics: {
    avgFCP: number;
    avgLCP: number;
    avgCLS: number;
    avgINP: number;
  };
  topPages: Array<{
    path: string;
    views: number;
  }>;
  recentReports: Array<{
    id: string;
    score: number;
    created_at: string;
    recommendations: string[];
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
      }

      const [analyticsData, performanceReports] = await Promise.all([
        analytics.getAnalyticsData(startDate, endDate),
        analytics.getPerformanceReports(10)
      ]);

      // Process analytics data
      const processedData = processAnalyticsData(analyticsData, performanceReports);
      setData(processedData);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (rawData: any[], reports: any[]): AnalyticsData => {
    const sessions = new Set(rawData.map(item => item.session_id));
    const users = new Set(rawData.filter(item => item.user_id).map(item => item.user_id));
    
    // Device breakdown
    const deviceBreakdown = { mobile: 0, tablet: 0, desktop: 0 };
    rawData.forEach(item => {
      if (item.viewport_width) {
        if (item.viewport_width < 768) deviceBreakdown.mobile++;
        else if (item.viewport_width < 1024) deviceBreakdown.tablet++;
        else deviceBreakdown.desktop++;
      }
    });

    // Performance metrics
    const performanceMetrics = {
      avgFCP: 0,
      avgLCP: 0,
      avgCLS: 0,
      avgINP: 0
    };

    if (reports.length > 0) {
      const validReports = reports.filter(r => r.metrics);
      if (validReports.length > 0) {
        performanceMetrics.avgFCP = validReports.reduce((sum, r) => sum + (r.metrics.fcp || 0), 0) / validReports.length;
        performanceMetrics.avgLCP = validReports.reduce((sum, r) => sum + (r.metrics.lcp || 0), 0) / validReports.length;
        performanceMetrics.avgCLS = validReports.reduce((sum, r) => sum + (r.metrics.cls || 0), 0) / validReports.length;
        performanceMetrics.avgINP = validReports.reduce((sum, r) => sum + (r.metrics.inp || 0), 0) / validReports.length;
      }
    }

    // Top pages
    const pageViews = rawData.filter(item => item.event_type === 'page_view');
    const pageCount: Record<string, number> = {};
    pageViews.forEach(item => {
      const path = item.event_data?.path || 'unknown';
      pageCount[path] = (pageCount[path] || 0) + 1;
    });
    
    const topPages = Object.entries(pageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([path, views]) => ({ path, views }));

    return {
      totalSessions: sessions.size,
      uniqueUsers: users.size,
      avgSessionDuration: 0, // Would need session tracking for this
      deviceBreakdown,
      performanceMetrics,
      topPages,
      recentReports: reports.slice(0, 5).map(r => ({
        id: r.id,
        score: r.score || 0,
        created_at: r.created_at,
        recommendations: r.recommendations || []
      }))
    };
  };

  const getPerformanceStatus = (metric: number, thresholds: [number, number]) => {
    if (metric <= thresholds[0]) return { status: 'good', color: 'text-green-400' };
    if (metric <= thresholds[1]) return { status: 'needs-improvement', color: 'text-yellow-400' };
    return { status: 'poor', color: 'text-red-400' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-400 py-12">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
        <p>Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          {(['24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-xl border border-gray-800 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold text-white">{data.totalSessions}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-primary-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-xl border border-gray-800 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Unique Users</p>
              <p className="text-2xl font-bold text-white">{data.uniqueUsers}</p>
            </div>
            <Users className="h-8 w-8 text-accent-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-xl border border-gray-800 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg FCP</p>
              <p className={`text-2xl font-bold ${getPerformanceStatus(data.performanceMetrics.avgFCP, [1800, 3000]).color}`}>
                {Math.round(data.performanceMetrics.avgFCP)}ms
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-xl border border-gray-800 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg LCP</p>
              <p className={`text-2xl font-bold ${getPerformanceStatus(data.performanceMetrics.avgLCP, [2500, 4000]).color}`}>
                {Math.round(data.performanceMetrics.avgLCP)}ms
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Device Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-xl border border-gray-800 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Smartphone className="h-8 w-8 text-primary-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.deviceBreakdown.mobile}</p>
            <p className="text-gray-400 text-sm">Mobile</p>
          </div>
          <div className="text-center">
            <Tablet className="h-8 w-8 text-accent-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.deviceBreakdown.tablet}</p>
            <p className="text-gray-400 text-sm">Tablet</p>
          </div>
          <div className="text-center">
            <Monitor className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{data.deviceBreakdown.desktop}</p>
            <p className="text-gray-400 text-sm">Desktop</p>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-xl border border-gray-800 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-gray-400 text-sm">First Contentful Paint</p>
            <p className={`text-xl font-bold ${getPerformanceStatus(data.performanceMetrics.avgFCP, [1800, 3000]).color}`}>
              {Math.round(data.performanceMetrics.avgFCP)}ms
            </p>
            <p className="text-xs text-gray-500">Target: &lt;1.8s</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Largest Contentful Paint</p>
            <p className={`text-xl font-bold ${getPerformanceStatus(data.performanceMetrics.avgLCP, [2500, 4000]).color}`}>
              {Math.round(data.performanceMetrics.avgLCP)}ms
            </p>
            <p className="text-xs text-gray-500">Target: &lt;2.5s</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Cumulative Layout Shift</p>
            <p className={`text-xl font-bold ${getPerformanceStatus(data.performanceMetrics.avgCLS, [0.1, 0.25]).color}`}>
              {data.performanceMetrics.avgCLS.toFixed(3)}
            </p>
            <p className="text-xs text-gray-500">Target: &lt;0.1</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Interaction to Next Paint</p>
            <p className={`text-xl font-bold ${getPerformanceStatus(data.performanceMetrics.avgINP, [200, 500]).color}`}>
              {Math.round(data.performanceMetrics.avgINP)}ms
            </p>
            <p className="text-xs text-gray-500">Target: &lt;200ms</p>
          </div>
        </div>
      </motion.div>

      {/* Top Pages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-dark-800/50 to-dark-900/50 rounded-xl border border-gray-800 p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Top Pages</h3>
        <div className="space-y-3">
          {data.topPages.map((page, index) => (
            <div key={page.path} className="flex justify-between items-center">
              <span className="text-gray-300">{page.path}</span>
              <span className="text-primary-400 font-medium">{page.views} views</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsDashboard;