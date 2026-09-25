import React, { useState } from 'react';
import { Download, CheckCircle2, Apple, Share2, PlusSquare, Sparkles, X, Globe, HardDrive } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const PWAInstallModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const isOnline = useOnlineStatus();
  const [justInstalled, setJustInstalled] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setJustInstalled(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 font-display">
              Download &amp; Run HemoPure Offline
            </h3>
            <p className="text-xs text-slate-400">
              Install as a standalone native app on any laptop, tablet, or smartphone.
            </p>
          </div>
        </div>

        {/* Online / Offline capability banner */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2 mb-4">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <HardDrive className="w-3.5 h-3.5" /> Full Offline Service Worker Active
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Globe className="w-3.5 h-3.5" /> {isOnline ? 'Online Synced' : 'Offline Ready'}
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            All physics models, particle fluidics, FTIR spectra databases, dosage calculators, and blueprint dossiers are precached locally on your device. Once installed, it runs anywhere without an internet connection.
          </p>
        </div>

        {/* State 1: Already installed */}
        {isInstalled || justInstalled ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-lg text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-emerald-300">HemoPure is Installed!</h4>
            <p className="text-xs text-slate-300">
              The application is running in standalone mode on your operating system with local asset persistence.
            </p>
          </div>
        ) : isInstallable ? (
          /* State 2: Chromium / Edge / Android native prompt */
          <div className="space-y-4">
            <div className="p-3.5 bg-cyan-950/20 border border-cyan-800/40 rounded-lg text-xs space-y-2">
              <span className="font-semibold text-cyan-300 block flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" /> 1-Click Desktop &amp; Mobile Install
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Click below to install HemoPure MNP directly into your OS launcher or home screen (macOS, Windows, ChromeOS, Linux, Android).
              </p>
            </div>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition font-mono shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              Install HemoPure App Now
            </button>
          </div>
        ) : isIOS ? (
          /* State 3: Apple iOS Safari Instructions */
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Apple className="w-4 h-4 text-slate-100" />
              <span>Install on iPhone / iPad (Safari)</span>
            </div>
            <ol className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[11px] font-mono shrink-0">1</span>
                <span>Tap the <strong className="text-cyan-300">Share</strong> button <Share2 className="w-3.5 h-3.5 inline mx-0.5" /> in your Safari bottom navigation bar.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[11px] font-mono shrink-0">2</span>
                <span>Scroll down and select <strong className="text-cyan-300">Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5" />.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[11px] font-mono shrink-0">3</span>
                <span>Tap <strong className="text-emerald-400">Add</strong> at top right. Launch HemoPure offline anytime!</span>
              </li>
            </ol>
          </div>
        ) : (
          /* State 4: Generic browser guidance */
          <div className="space-y-3 text-xs text-slate-300">
            <p className="leading-relaxed">
              To install on this browser:
            </p>
            <ul className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 list-disc list-inside text-slate-400 text-[11px]">
              <li>Look for the <strong className="text-cyan-300">Install icon (⊕ or ⬇)</strong> in your browser address bar.</li>
              <li>Or open the browser menu (⋮ / ⋯) and select <strong className="text-slate-200">"Install HemoPure MNP"</strong> or <strong className="text-slate-200">"Save and Share" → "Create shortcut"</strong>.</li>
            </ul>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
