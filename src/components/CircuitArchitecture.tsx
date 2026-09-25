import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Magnet,
  Filter,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Info,
  Droplets
} from 'lucide-react';
import { ApheresisTelemetry } from '../types/apheresis';

interface CircuitArchitectureProps {
  telemetry: ApheresisTelemetry;
  isRunning: boolean;
}

interface CircuitNode {
  id: string;
  name: string;
  category: 'Vascular' | 'Separation' | 'Fluidics' | 'Safety' | 'Detection';
  icon: React.ElementType;
  operatingValue: string;
  safetyTolerance: string;
  mechanism: string;
  clinicalSignificance: string;
}

const CIRCUIT_NODES: CircuitNode[] = [
  {
    id: 'access',
    name: 'Dual-Lumen Venous Access',
    category: 'Vascular',
    icon: Droplets,
    operatingValue: '180 mL/min Inflow',
    safetyTolerance: 'Pressure: -120 to -40 mmHg',
    mechanism: '14-16 Gauge biocompatible polyurethane catheter inserted into internal jugular or femoral vein, coated with immobilized heparin to prevent cannula microthrombi.',
    clinicalSignificance: 'Ensures stable extracorporeal blood supply without collapsing peripheral vascular lumen.',
  },
  {
    id: 'anticoagulant',
    name: 'Regional Citrate / Heparin Pump',
    category: 'Fluidics',
    icon: Activity,
    operatingValue: 'ACD-A 1:12 Blood Ratio',
    safetyTolerance: 'Ionized Ca²⁺: 0.25–0.35 mmol/L (circuit)',
    mechanism: 'Infuses acid-citrate-dextrose (ACD-A) or low-molecular-weight heparin directly into inlet port to chelate Ca²⁺ and block factor Xa, preventing clotting within plastic contact surfaces.',
    clinicalSignificance: 'Avoids systemic patient anticoagulation by neutralizing citrate via post-filter calcium chloride re-infusion.',
  },
  {
    id: 'acoustic',
    name: 'Acoustophoretic Standing Wave Resonator',
    category: 'Separation',
    icon: Radio,
    operatingValue: '2.45 MHz · 12.0 W Piezo Power',
    safetyTolerance: 'Shear Stress: < 150 dyn/cm²',
    mechanism: 'Piezoelectric ultrasound transducer generates continuous ultrasonic standing waves. Blood cells (positive acoustic contrast) focus into the central laminar streamline, while synthetic microplastics migrate laterally into side waste collectors.',
    clinicalSignificance: 'Zero-shear, sheathless continuous pre-separation of microplastics (5–100 µm) with 0% membrane fouling and zero red blood cell hemolysis.',
  },
  {
    id: 'spion',
    name: 'Biofunctionalized SPION Extractor',
    category: 'Separation',
    icon: Magnet,
    operatingValue: '1.8 Tesla · NdFeB Halbach Array',
    safetyTolerance: 'Fe Leakage: < 0.05 µg/dL (below assay limit)',
    mechanism: 'Infuses biocompatible superparamagnetic iron oxide nanoparticles (30 nm) with lipid-hydrophobic functionalization. SPIONs selectively adsorb to hydrophobic plastic polymer coronas, and a high-gradient magnetic separator (HGMS) pulls them into a capture matrix.',
    clinicalSignificance: 'Extracts submicron particles (100–1000 nm) that escape size-exclusion filters, with a downstream magnetometric sensor ensuring 100% nanoparticle retention.',
  },
  {
    id: 'hemoperfusion',
    name: 'MIP Macroporous Cartridge',
    category: 'Separation',
    icon: Filter,
    operatingValue: 'Crosslinked Hydrogel Matrix',
    safetyTolerance: 'Albumin Loss: < 2.5% per pass',
    mechanism: 'Molecularly Imprinted Polymers (MIPs) with synthetic cavities complementary to phthalate esters, styrene oligomers, and synthetic polymer backbones bind nanoplastics < 100 nm via shape-affinity and hydrophobic interactions.',
    clinicalSignificance: 'Clears the most toxic nanoplastic fraction capable of penetrating endothelial tight junctions and the blood-brain barrier.',
  },
  {
    id: 'raman',
    name: 'Inline Micro-Raman Laser Detector',
    category: 'Detection',
    icon: Sparkles,
    operatingValue: '785 nm Diode Laser · 50 mW',
    safetyTolerance: 'Limit of Detection: 0.1 µg/mL',
    mechanism: 'Continuous confocal Raman spectroscopy coupled with darkfield optical particle scatter counts residual polymer particles in real time and classifies polymer fingerprint bands.',
    clinicalSignificance: 'Provides live verification of blood effluent purity before patient re-infusion.',
  },
  {
    id: 'bubble',
    name: 'Venous Air Detector & Auto-Clamp',
    category: 'Safety',
    icon: ShieldAlert,
    operatingValue: 'Ultrasonic Bubble Monitor',
    safetyTolerance: 'Air Bubble Threshold: > 0.02 mL',
    mechanism: 'Dual-frequency ultrasonic beam monitors efferent tubing. If microscopic micro-bubbles or foam are detected, high-speed solenoid pinch clamp seals line in < 8 milliseconds and halts blood pump.',
    clinicalSignificance: 'Critical life-safety fail-safe protecting patient against venous air embolism.',
  },
];

export const CircuitArchitecture: React.FC<CircuitArchitectureProps> = ({ telemetry, isRunning }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('spion');

  const selectedNode = CIRCUIT_NODES.find((n) => n.id === selectedNodeId) || CIRCUIT_NODES[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 font-display tracking-tight flex items-center gap-2">
            <span>Extracorporeal Circuit Architecture</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              ISO 10993 Biocompatibility Standard
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Continuous multi-stage apheresis loop designed to extract synthetic polymers while preserving red blood cells, platelets, and plasma proteins.
          </p>
        </div>

        {/* Live Safety Status */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-300">Hemolysis: {telemetry.freeHemoglobinMgDl.toFixed(1)} mg/dL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300">TMP: {telemetry.transmembranePressureMmHg.toFixed(0)} mmHg</span>
          </div>
        </div>
      </div>

      {/* Interactive Circuit Schematic Flow Diagram */}
      <div className="mt-5 relative overflow-x-auto pb-2">
        <div className="min-w-[840px] flex items-center justify-between gap-1 p-3 bg-slate-950 rounded-lg border border-slate-800">
          {CIRCUIT_NODES.map((node, index) => {
            const isSelected = node.id === selectedNodeId;
            const Icon = node.icon;

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <button
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`flex flex-col items-center p-2.5 rounded-md border transition-all text-left group relative ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-md ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                  style={{ width: '135px' }}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span className="text-[10px] font-mono text-slate-500">0{index + 1}</span>
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isSelected ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 line-clamp-1 w-full">
                    {node.name.split(' ')[0]} {node.name.split(' ')[1] || ''}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1 truncate w-full">
                    {node.operatingValue}
                  </span>

                  {/* Pulsing indicator if active */}
                  {isRunning && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>

                {/* Connecting Tubing Arrow */}
                {index < CIRCUIT_NODES.length - 1 && (
                  <div className="flex items-center text-slate-600 px-0.5">
                    <div
                      className={`h-0.5 w-3 ${
                        isRunning ? 'bg-gradient-to-r from-red-600 to-rose-400' : 'bg-slate-700'
                      }`}
                    />
                    <ChevronRight className="w-3.5 h-3.5 -ml-1 text-slate-500" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Engineering Details Panel */}
      <div className="mt-4 p-4 bg-slate-950/70 border border-slate-800 rounded-lg">
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 border border-slate-700 rounded text-cyan-400">
              <selectedNode.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100 font-display">
                {selectedNode.name}
              </h3>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                <span>Category: {selectedNode.category}</span>
                <span aria-hidden="true">·</span>
                <span>Calibrated Setpoint: {selectedNode.operatingValue}</span>
              </div>
            </div>
          </div>

          <div className="px-3 py-1 bg-slate-900 rounded border border-slate-800 text-xs font-mono text-emerald-400">
            {selectedNode.safetyTolerance}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs leading-relaxed">
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Biophysical & Chemical Mechanism
            </span>
            <p className="text-slate-300">
              {selectedNode.mechanism}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Clinical Safety & Blood Preservation
            </span>
            <p className="text-slate-300">
              {selectedNode.clinicalSignificance}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Extracorporeal blood contact materials: Medical-grade USP Class VI silicone & fluorinated ethylene propylene (FEP)</span>
          </div>
          <span>Ref: Extracorporeal Life Support Organization (ELSO) Guidelines</span>
        </div>
      </div>
    </div>
  );
};
