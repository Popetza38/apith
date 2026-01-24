// ============================================
// Service Worker Registration
// ============================================
// Utility functions untuk service worker management

const SW_URL = '/sw.js';

/**
 * Register service worker
 */
export function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register(SW_URL)
        .then((registration) => {
          console.log('SW registered:', registration);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available
                  window.dispatchEvent(new CustomEvent('sw-update-available'));
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('SW registration failed:', error);
        });
    });
  }
}

/**
 * Unregister service worker
 */
export function unregisterSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .then(() => console.log('SW unregistered'));
  }
}

/**
 * Wait for service worker to be activated
 */
export function waitForSWUpdate(): Promise<void> {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => resolve());
    } else {
      resolve();
    }
  });
}

/**
 * Skip waiting and activate new service worker immediately
 */
export function skipWaiting(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then((registration) => {
      registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
    });
  }
}

/**
 * Get current service worker registration
 */
export async function getSWRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if ('serviceWorker' in navigator) {
    try {
      return await navigator.serviceWorker.getRegistration() ?? undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}
