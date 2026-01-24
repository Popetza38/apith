// ============================================
// Push Notification Utilities
// ============================================
// Utilities untuk push notifications di PWA

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Browser tidak mendukung notifikasi');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator)) {
    console.log('Service Worker tidak didukung');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check jika sudah subscribe
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      return existingSubscription;
    }

    // Subscribe ke push service
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
    });

    // Send subscription ke server
    if (subscription) {
      await sendSubscriptionToServer(subscription);
    }

    return subscription;
  } catch (error) {
    console.error('Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await deleteSubscriptionFromServer(subscription);
    }
  } catch (error) {
    console.error('Push unsubscribe failed:', error);
  }
}

/**
 * Send subscription to server
 */
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) {
      throw new Error('Failed to send subscription to server');
    }
  } catch (error) {
    console.error('Failed to send subscription:', error);
  }
}

/**
 * Delete subscription from server
 */
async function deleteSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    });
  } catch (error) {
    console.error('Failed to delete subscription:', error);
  }
}

/**
 * Show local notification
 */
export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-96x96.png',
      // vibrate not supported in all browsers
      ...(options as any)
    });
  }
}

/**
 * Check if notifications are supported
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
  if ('Notification' in window) {
    return Notification.permission;
  }
  return 'denied';
}
