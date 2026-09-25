import React, { useState } from 'react';
import { Download, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { PWAInstallModal } from './PWAInstallModal';

export const PWAInstallButton: React.FC = () => {
  const { isInstalled } = usePWAInstall();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-3 py-1.5 text-xs font-mono font-bold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
        title="Download & install HemoPure MNP app for offline desktop or mobile use"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span className="hidden sm:inline">{isInstalled ? 'Offline App' : 'Download App'}</span>
      </button>

      <PWAInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-lg bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-mono text-slate-950 shadow-xl border border-amber-400">
      <WifiOff className="w-4 h-4 text-slate-950 shrink-0" />
      <div>
        <span className="font-bold">Offline Mode Active</span> — Complete fluidic physics and blueprints cached locally.
      </div>
    </div>
  );
};
