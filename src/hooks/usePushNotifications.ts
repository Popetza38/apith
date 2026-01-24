// ============================================
// Push Notification Hook
// ============================================
// Hook untuk manage push notifications di app

"use client";

import { useEffect, useState } from "react";
import {
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isNotificationSupported,
  getNotificationPermission,
  showNotification
} from "@/lib/notifications";

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    setPermission(getNotificationPermission());

    // Check subscription status
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(async (registration) => {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      });
    }
  }, []);

  /**
   * Request notification permission
   */
  const requestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermission(granted ? 'granted' : 'denied');
    return granted;
  };

  /**
   * Subscribe to push notifications
   */
  const subscribe = async () => {
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    const subscription = await subscribeToPushNotifications();
    if (subscription) {
      setIsSubscribed(true);
    }
    return !!subscription;
  };

  /**
   * Unsubscribe from push notifications
   */
  const unsubscribe = async () => {
    await unsubscribeFromPushNotifications();
    setIsSubscribed(false);
  };

  /**
   * Show a local notification
   */
  const notify = (title: string, options?: NotificationOptions) => {
    showNotification(title, options);
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    notify
  };
}
