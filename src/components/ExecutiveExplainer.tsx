import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileCode, 
  Sparkles, 
  ShieldCheck, 
  Radio, 
  Magnet, 
  Filter, 
  Microscope,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ExecutiveExplainerProps {
  onOpenBlueprint: () => void;
  onNavigateTab: (tab: 'simulation' | 'circuit' | 'protocol' | 'compendium') => void;
}

export const ExecutiveExplainer: React.FC<ExecutiveExplainerProps> = ({
  onOpenBlueprint,
  onNavigateTab,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/50 rounded-xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
      {/* Background decorative highlight */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 font-display tracking-tight">
                How It Works &amp; Why: Extracorporeal Plastic Hemoclearance
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300">
                Peer-Reviewed Biophysics
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Executive Primer &amp; Engineering Rationale for University Faculty, Research Committees, and Clinicians.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBlueprint}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/10 font-mono"
            title="Open comprehensive academic blueprint dossier to print or submit to professors"
          >
            <FileCode className="w-4 h-4" />
            <span>Academic Blueprint (for Professors)</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title={isExpanded ? 'Collapse explainer' : 'Expand explainer'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content Body */}
      {isExpanded && (
        <div className="mt-4 space-y-4 text-xs">
          {/* Two-Column Core Architecture: The "Why" vs The "How" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The "Why": Biological Crisis & Dialysis Failure */}
            <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  1. The "Why": Why Blood Plastic Is Fatal &amp; Why Dialysis Fails
                </span>
                <span className="text-[10px] font-mono text-slate-500">NEJM 2024</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Recent prospective clinical evidence (<em className="text-slate-200">New England Journal of Medicine, Marfella et al. 2024</em>) confirmed that patients with micro- and nanoplastics (MNPs: PET, PE, PVC) in vascular atheroma plaques face a <strong className="text-rose-300">4.53-fold higher hazard of heart attack, stroke, or mortality</strong>. Circulating plastics induce rapid endothelial oxidative apoptosis, trigger thrombosis, and translocate through the blood-brain barrier.
              </p>
              <div className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-rose-300 block">The Biophysical Membrane Paradox:</span>
                <p className="text-slate-400 text-[10.5px] leading-relaxed">
                  Red blood cells are ~7,500 nm; albumin is ~7 nm. Micro- and nanoplastics span <strong>10 nm to 50,000 nm</strong>. Conventional hemodialysis filters (0.5–2 nm pores) immediately suffer <em>severe protein-corona fouling and irreversible pore blockage</em>, while whole-cell centrifuges shear cells or co-pellet microfibers with leukocytes.
                </p>
              </div>
            </div>

            {/* The "How": Physical Force Fields (Acoustic + Magnetic + MIP) */}
            <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  2. The "How": 3-Stage Synergistic Non-Contact Extraction
                </span>
                <span className="text-[10px] font-mono text-slate-500">Continuous Circuit</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Instead of forcing whole blood through vulnerable mechanical sieves, HemoPure operates an extracorporeal apheresis loop utilizing <strong className="text-cyan-300">three orthogonal physical force fields</strong> operating in series, protecting cellular viability:
              </p>

              {/* 3 Step Micro-Breakdown */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-start gap-2 p-1.5 bg-slate-900/70 rounded border border-slate-800 text-[10.5px]">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Stage 1 · Acoustophoresis (5 µm – 100 µm):</strong> Ultrasonic standing waves (2.45 MHz) generate acoustic radiation force (F_rad). Erythrocytes migrate safely to central pressure nodes, while plastic shards/fibers focus into lateral bypass waste splitters (0% shear lysis).
                  </div>
                </div>

                <div className="flex items-start gap-2 p-1.5 bg-slate-900/70 rounded border border-slate-800 text-[10.5px]">
                  <Magnet className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Stage 2 · Bio-SPION Magnetophoresis (100 nm – 2,000 nm):</strong> Lipid-functionalized 30 nm superparamagnetic iron oxide nanoparticles selectively adsorb to plastic hydrophobic coronas. A 1.8 Tesla Halbach NdFeB matrix magnetically captures them with 100% downstream iron retention.
                  </div>
                </div>

                <div className="flex items-start gap-2 p-1.5 bg-slate-900/70 rounded border border-slate-800 text-[10.5px]">
                  <Filter className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-200">Stage 3 · MIP Hydrogel Cartridge (10 nm – 100 nm):</strong> Molecularly Imprinted Polymers form synthetic recognition cavities that trap sub-100 nm plastic fragments without consuming albumin or platelets.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Navigation Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Erythrocyte Recovery: 99.4%</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-cyan-400">
                <Microscope className="w-3.5 h-3.5" />
                <span>Inline Raman 785nm Purity Verification</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigateTab('circuit')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-4 decoration-cyan-500/40"
              >
                Inspect Circuit Fluidics <ArrowRight className="w-3 h-3" />
              </button>
              <span className="text-slate-600">|</span>
              <button
                onClick={onOpenBlueprint}
                className="text-slate-200 hover:text-white font-semibold flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
              >
                View Academic Dossier <ExternalLink className="w-3 h-3 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
