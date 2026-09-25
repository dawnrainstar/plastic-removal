import React from 'react';
import { FileText, Play, Pause, FileCode } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: 'simulation' | 'circuit' | 'protocol' | 'compendium';
  onSelectTab: (tab: 'simulation' | 'circuit' | 'protocol' | 'compendium') => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  onOpenReport: () => void;
  onOpenBlueprint: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  isRunning,
  onTogglePlay,
  onOpenReport,
  onOpenBlueprint,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element brand wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('simulation');
        }}
        className="text-lg font-bold tracking-tight text-slate-100 font-display flex items-center gap-2"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
        <span>HemoPure MNP</span>
      </a>

      {/* Zone 2: 4 clean text navigation links with hover states */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
        <button
          onClick={() => onSelectTab('simulation')}
          className={`transition-colors pb-0.5 border-b-2 ${
            activeTab === 'simulation'
              ? 'text-cyan-300 border-cyan-400 font-semibold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Apheresis Lab
        </button>
        <button
          onClick={() => onSelectTab('circuit')}
          className={`transition-colors pb-0.5 border-b-2 ${
            activeTab === 'circuit'
              ? 'text-cyan-300 border-cyan-400 font-semibold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Circuit Schematic
        </button>
        <button
          onClick={() => onSelectTab('protocol')}
          className={`transition-colors pb-0.5 border-b-2 ${
            activeTab === 'protocol'
              ? 'text-cyan-300 border-cyan-400 font-semibold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Patient Protocol
        </button>
        <button
          onClick={() => onSelectTab('compendium')}
          className={`transition-colors pb-0.5 border-b-2 ${
            activeTab === 'compendium'
              ? 'text-cyan-300 border-cyan-400 font-semibold'
              : 'border-transparent hover:text-slate-200'
          }`}
        >
          Clinical Evidence
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-2">
        <PWAInstallButton />

        <button
          onClick={onOpenBlueprint}
          className="hidden sm:flex px-3 py-1.5 text-xs font-mono font-bold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 rounded transition-colors whitespace-nowrap items-center gap-1.5 shadow-sm"
          title="Open Academic Blueprint Spec Sheet for Professors"
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Blueprint Dossier</span>
        </button>

        <button
          onClick={onTogglePlay}
          className={`px-3 py-1.5 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            isRunning
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause Run</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Start Run</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenReport}
          className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700 hover:border-slate-500 rounded transition-colors whitespace-nowrap flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Summary</span>
        </button>
      </div>
    </header>
  );
};
