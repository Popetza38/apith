// ============================================
// Service Worker Update Banner Component
// ============================================
// Component untuk menampilkan banner saat ada update service worker baru

"use client";

import { useEffect, useState } from "react";
import { X, Download } from "lucide-react";
import { skipWaiting, waitForSWUpdate } from "@/lib/sw-registration";

export function SWUpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Listen for custom event from service worker
    const handleUpdateAvailable = () => {
      setShowBanner(true);
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleUpdate = async () => {
    // Skip waiting and activate new service worker
    skipWaiting();
    // Wait for new service worker to be activated
    await waitForSWUpdate();
    // Reload the page
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className="max-w-md mx-auto bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-4 shadow-2xl flex items-start gap-3">
        <div className="flex-shrink-0">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold mb-1">
            Update Tersedia!
          </p>
          <p className="text-white/90 text-sm">
            Versi baru DramaBox siap diinstall. Refresh untuk mendapatkan fitur terbaru.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-white text-primary font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors touch-manipulation"
            >
              Update Sekarang
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 bg-white/20 text-white font-semibold rounded-lg text-sm hover:bg-white/30 transition-colors touch-manipulation"
            >
              Nanti
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-white/80 hover:text-white transition-colors touch-manipulation"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
