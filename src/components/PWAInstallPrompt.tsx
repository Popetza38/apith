// ============================================
// PWA Install Prompt Component
// ============================================
// Component untuk menampilkan "Add to Home Screen" prompt

"use client";

import { useEffect, useState } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { cn } from "@/lib/utils";

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, promptInstall } = useInstallPrompt();
  const { isSupported, permission, requestPermission, subscribe } = usePushNotifications();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');
    const lastShown = localStorage.getItem('pwa-install-last-shown');

    // Show banner if installable and not recently dismissed
    if (isInstallable && !wasDismissed) {
      // Only show if not shown in the last 7 days
      const shouldShow = !lastShown || Date.now() - parseInt(lastShown) > 7 * 24 * 60 * 60 * 1000;
      if (shouldShow) {
        // Delay showing banner by 30 seconds
        const timer = setTimeout(() => setShowBanner(true), 30000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable]);

  const handleInstall = async () => {
    await promptInstall();
    setShowBanner(false);
    localStorage.setItem('pwa-install-last-shown', Date.now().toString());
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      await subscribe();
    }
  };

  // Don't show if already installed or dismissed
  if (isInstalled || dismissed || !showBanner) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 md:hidden">
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-white font-semibold mb-1">
              Install DramaBox
            </p>
            <p className="text-white/90 text-sm mb-3">
              Install aplikasi untuk pengalaman terbaik. Akses cepat dari home screen!
            </p>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 px-4 py-2 bg-white text-primary font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors touch-manipulation flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Install
              </button>
              {isSupported && permission !== 'granted' && (
                <button
                  onClick={handleEnableNotifications}
                  className="px-4 py-2 bg-white/20 text-white font-semibold rounded-lg text-sm hover:bg-white/30 transition-colors touch-manipulation"
                >
                  Notif
                </button>
              )}
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-white/80 hover:text-white transition-colors touch-manipulation ml-2"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
