// ============================================
// Install Prompt Hook for PWA
// ============================================
// Hook untuk handle "Add to Home Screen" prompt di mobile

import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed as PWA
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInApp);
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const appInstalledHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  /**
   * Show install prompt to user
   */
  const promptInstall = async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available');
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
      setIsInstalled(true);
    } else {
      console.log('PWA install dismissed');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return {
    isInstallable,
    isInstalled,
    promptInstall
  };
}
