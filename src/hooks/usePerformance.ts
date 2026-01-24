// ============================================
// Performance Hooks
// ============================================
// Collection of hooks untuk performance monitoring dan optimization

import { useEffect, useState, useRef } from "react";

/**
 * Hook untuk mengukur Core Web Vitals
 */
export function useCoreWebVitals() {
  const [metrics, setMetrics] = useState({
    LCP: 0,
    FID: 0,
    CLS: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Measure LCP (Largest Contentful Paint)
    const observeLCP = () => {
      const observe = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          setMetrics((prev) => ({ ...prev, LCP: lastEntry.renderTime || lastEntry.startTime }));
        }
      });
      observe.observe({ entryTypes: ['largest-contentful-paint'] });
      return observe;
    };

    // Measure FID (First Input Delay)
    const observeFID = () => {
      const observe = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        entries.forEach((entry) => {
          if (entry.name === 'first-input') {
            setMetrics((prev) => ({ ...prev, FID: entry.processingStart - entry.startTime }));
          }
        });
      });
      observe.observe({ entryTypes: ['first-input'] });
      return observe;
    };

    // Measure CLS (Cumulative Layout Shift)
    let clsScore = 0;
    const observeCLS = () => {
      const observe = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[];
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsScore += entry.value;
            setMetrics((prev) => ({ ...prev, CLS: clsScore }));
          }
        });
      });
      observe.observe({ entryTypes: ['layout-shift'] });
      return observe;
    };

    const observers: PerformanceObserver[] = [];
    if ('PerformanceObserver' in window) {
      observers.push(observeLCP());
      observers.push(observeFID());
      observers.push(observeCLS());
    }

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return metrics;
}

/**
 * Hook untuk detect slow connections (3G, slow 4G)
 */
export function useConnectionSpeed() {
  const [connection, setConnection] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 100,
    saveData: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !('connection' in navigator)) return;

    const conn = (navigator as any).connection;

    const updateConnection = () => {
      setConnection({
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData,
      });
    };

    updateConnection();

    conn.addEventListener('change', updateConnection);

    return () => {
      conn.removeEventListener('change', updateConnection);
    };
  }, []);

  const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
  const isDataSaver = connection.saveData;

  return {
    ...connection,
    isSlowConnection,
    isDataSaver,
  };
}

/**
 * Hook untuk defer rendering non-critical content
 */
export function useDeferredRender(delay = 0) {
  const [shouldRender, setShouldRender] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;

    const timer = setTimeout(() => {
      requestIdleCallback(() => setShouldRender(true));
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldRender;
}

/**
 * Hook untuk Intersection Observer (lazy loading)
 */
export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });

    const current = targetRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return [targetRef, isIntersecting] as const;
}
