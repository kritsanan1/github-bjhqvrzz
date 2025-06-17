import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/analytics';

// Hook for tracking page views
export const usePageTracking = () => {
  const location = useLocation();
  const previousPath = useRef<string>('');

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    
    // Only track if path actually changed
    if (currentPath !== previousPath.current) {
      analytics.trackPageView(currentPath, document.title);
      previousPath.current = currentPath;
    }
  }, [location]);
};

// Hook for tracking user authentication
export const useAuthTracking = (userId: string | null) => {
  useEffect(() => {
    analytics.setUserId(userId);
    
    if (userId) {
      analytics.trackEvent('user_login', { userId });
    }
  }, [userId]);
};

// Hook for tracking component interactions
export const useInteractionTracking = (componentName: string) => {
  const trackInteraction = (action: string, properties?: Record<string, any>) => {
    analytics.trackEvent('component_interaction', {
      component: componentName,
      action,
      ...properties
    });
  };

  return { trackInteraction };
};

// Hook for tracking form events
export const useFormTracking = (formName: string) => {
  const trackFormStart = () => {
    analytics.trackEvent('form_start', { formName });
  };

  const trackFormComplete = (success: boolean, errors?: string[]) => {
    analytics.trackEvent('form_complete', {
      formName,
      success,
      errors: errors || []
    });
  };

  const trackFieldInteraction = (fieldName: string, action: 'focus' | 'blur' | 'change') => {
    analytics.trackEvent('form_field_interaction', {
      formName,
      fieldName,
      action
    });
  };

  return {
    trackFormStart,
    trackFormComplete,
    trackFieldInteraction
  };
};

// Hook for tracking performance issues
export const usePerformanceTracking = () => {
  useEffect(() => {
    // Track long tasks
    if ('PerformanceObserver' in window) {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) { // Tasks longer than 50ms
            analytics.trackEvent('long_task', {
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        }
      });

      try {
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        console.warn('Long task observer not supported:', e);
      }

      return () => {
        longTaskObserver.disconnect();
      };
    }
  }, []);

  // Track JavaScript errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      analytics.trackEvent('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      analytics.trackEvent('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
};