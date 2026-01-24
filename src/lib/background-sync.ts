// ============================================
// Background Sync Utilities
// ============================================
// Utilities untuk background sync di PWA

/**
 * Register background sync
 */
export async function registerBackgroundSync(tag: string): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker tidak didukung');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    // Type assertion for sync API
    await (registration as any).sync.register(tag);
    console.log('Background sync registered:', tag);
  } catch (error) {
    console.error('Background sync registration failed:', error);
  }
}

/**
 * Check if background sync is supported
 */
export function isBackgroundSyncSupported(): boolean {
  return 'serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype;
}

/**
 * Request background sync
 */
export function requestBackgroundSync(tag: string): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      (registration as any).sync.register(tag);
    });
  }
}
