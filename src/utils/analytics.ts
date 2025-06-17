import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for analytics
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Generate unique session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID
let sessionId = sessionStorage.getItem('analytics_session_id');
if (!sessionId) {
  sessionId = generateSessionId();
  sessionStorage.setItem('analytics_session_id', sessionId);
}

// Core Web Vitals and Performance Metrics
interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  cls?: number; // Cumulative Layout Shift
  inp?: number; // Interaction to Next Paint
  ttfb?: number; // Time to First Byte
  fid?: number; // First Input Delay (deprecated, replaced by INP)
}

interface AnalyticsEvent {
  eventType: string;
  eventData?: Record<string, any>;
  performanceMetrics?: PerformanceMetrics;
}

class Analytics {
  private sessionId: string;
  private userId: string | null = null;
  private performanceMetrics: PerformanceMetrics = {};
  private performanceObserver: PerformanceObserver | null = null;

  constructor() {
    this.sessionId = sessionId!;
    this.initializePerformanceTracking();
    this.trackViewport();
    this.trackUserInteractions();
  }

  // Set user ID when user logs in
  setUserId(userId: string | null) {
    this.userId = userId;
  }

  // Track viewport changes
  private trackViewport() {
    const trackViewportChange = () => {
      this.track('viewport_change', {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
        orientation: screen.orientation?.type || 'unknown'
      });
    };

    // Track initial viewport
    trackViewportChange();

    // Track viewport changes
    window.addEventListener('resize', trackViewportChange);
    window.addEventListener('orientationchange', trackViewportChange);
  }

  // Track user interactions
  private trackUserInteractions() {
    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      // Track button clicks
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        this.track('button_click', {
          buttonText: button?.textContent?.trim(),
          buttonClass: button?.className,
          elementId: button?.id
        });
      }

      // Track link clicks
      if (target.tagName === 'A' || target.closest('a')) {
        const link = target.tagName === 'A' ? target : target.closest('a');
        this.track('link_click', {
          href: (link as HTMLAnchorElement)?.href,
          linkText: link?.textContent?.trim()
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.track('form_submit', {
        formId: form.id,
        formClass: form.className,
        action: form.action
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        
        // Track scroll milestones
        if (scrollDepth >= 25 && scrollDepth < 50) {
          this.track('scroll_depth', { depth: 25 });
        } else if (scrollDepth >= 50 && scrollDepth < 75) {
          this.track('scroll_depth', { depth: 50 });
        } else if (scrollDepth >= 75 && scrollDepth < 90) {
          this.track('scroll_depth', { depth: 75 });
        } else if (scrollDepth >= 90) {
          this.track('scroll_depth', { depth: 90 });
        }
      }
    });
  }

  // Initialize performance tracking
  private initializePerformanceTracking() {
    // Track Core Web Vitals using PerformanceObserver
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.performanceMetrics.lcp = entry.startTime;
          }
          
          if (entry.entryType === 'first-input') {
            this.performanceMetrics.fid = (entry as any).processingStart - entry.startTime;
          }

          if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
            this.performanceMetrics.cls = (this.performanceMetrics.cls || 0) + (entry as any).value;
          }
        }
      });

      try {
        this.performanceObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        console.warn('Performance Observer not fully supported:', e);
      }
    }

    // Track Navigation Timing
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          this.performanceMetrics.ttfb = navigation.responseStart - navigation.requestStart;
          
          // First Contentful Paint
          const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
          if (fcpEntry) {
            this.performanceMetrics.fcp = fcpEntry.startTime;
          }

          // Send performance report
          this.sendPerformanceReport();
        }
      }, 1000);
    });

    // Track INP (Interaction to Next Paint) - newer metric
    if ('PerformanceObserver' in window) {
      try {
        const inpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.entryType === 'event' && (entry as any).interactionId) {
              this.performanceMetrics.inp = Math.max(
                this.performanceMetrics.inp || 0,
                (entry as any).processingEnd - entry.startTime
              );
            }
          }
        });
        
        inpObserver.observe({ type: 'event', buffered: true });
      } catch (e) {
        console.warn('INP tracking not supported:', e);
      }
    }
  }

  // Send performance report to Supabase
  private async sendPerformanceReport() {
    const score = this.calculatePerformanceScore();
    const recommendations = this.generateRecommendations();

    try {
      await supabase.from('performance_reports').insert({
        session_id: this.sessionId,
        report_type: 'core-web-vitals',
        metrics: this.performanceMetrics,
        recommendations,
        score
      });
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }

  // Calculate performance score based on Core Web Vitals
  private calculatePerformanceScore(): number {
    let score = 100;
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (this.performanceMetrics.lcp) {
      if (this.performanceMetrics.lcp > 4000) score -= 30;
      else if (this.performanceMetrics.lcp > 2500) score -= 15;
    }

    // FCP scoring (good: <1.8s, needs improvement: 1.8-3s, poor: >3s)
    if (this.performanceMetrics.fcp) {
      if (this.performanceMetrics.fcp > 3000) score -= 25;
      else if (this.performanceMetrics.fcp > 1800) score -= 10;
    }

    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (this.performanceMetrics.cls) {
      if (this.performanceMetrics.cls > 0.25) score -= 25;
      else if (this.performanceMetrics.cls > 0.1) score -= 10;
    }

    // INP scoring (good: <200ms, needs improvement: 200-500ms, poor: >500ms)
    if (this.performanceMetrics.inp) {
      if (this.performanceMetrics.inp > 500) score -= 20;
      else if (this.performanceMetrics.inp > 200) score -= 10;
    }

    return Math.max(0, score);
  }

  // Generate optimization recommendations
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.performanceMetrics.lcp && this.performanceMetrics.lcp > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing critical resources');
    }

    if (this.performanceMetrics.fcp && this.performanceMetrics.fcp > 1800) {
      recommendations.push('Improve First Contentful Paint by eliminating render-blocking resources and optimizing critical rendering path');
    }

    if (this.performanceMetrics.cls && this.performanceMetrics.cls > 0.1) {
      recommendations.push('Reduce Cumulative Layout Shift by setting size attributes on images and avoiding dynamic content insertion');
    }

    if (this.performanceMetrics.inp && this.performanceMetrics.inp > 200) {
      recommendations.push('Optimize Interaction to Next Paint by reducing JavaScript execution time and optimizing event handlers');
    }

    if (this.performanceMetrics.ttfb && this.performanceMetrics.ttfb > 600) {
      recommendations.push('Improve Time to First Byte by optimizing server response times and using CDN');
    }

    return recommendations;
  }

  // Main tracking method
  async track(eventType: string, eventData: Record<string, any> = {}) {
    try {
      await supabase.from('client_analytics').insert({
        user_id: this.userId,
        session_id: this.sessionId,
        event_type: eventType,
        event_data: eventData,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        user_agent: navigator.userAgent,
        performance_metrics: this.performanceMetrics
      });
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  // Track page views
  trackPageView(path: string, title: string) {
    this.track('page_view', {
      path,
      title,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }

  // Track custom events
  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    this.track('custom_event', {
      event_name: eventName,
      ...properties
    });
  }

  // Get analytics data (for dashboard)
  async getAnalyticsData(startDate?: Date, endDate?: Date) {
    try {
      let query = supabase
        .from('client_analytics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (startDate) {
        query = query.gte('timestamp', startDate.toISOString());
      }
      
      if (endDate) {
        query = query.lte('timestamp', endDate.toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      return [];
    }
  }

  // Get performance reports
  async getPerformanceReports(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('performance_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch performance reports:', error);
      return [];
    }
  }

  // Cleanup
  destroy() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Export types
export type { PerformanceMetrics, AnalyticsEvent };