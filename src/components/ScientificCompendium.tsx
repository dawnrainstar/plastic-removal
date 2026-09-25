import React, { useState } from 'react';
import { BookOpen, ExternalLink, Dna, ShieldAlert, Cpu } from 'lucide-react';
import { CLINICAL_STUDIES, POLYMER_REGISTRY } from '../data/polymers';
import { PolymerType } from '../types/apheresis';

export const ScientificCompendium: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'polymers' | 'mechanisms'>('evidence');
  const [selectedPolymerKey, setSelectedPolymerKey] = useState<PolymerType>('PET');

  const selectedPolymer = POLYMER_REGISTRY[selectedPolymerKey];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
      {/* Header and Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-100 font-display tracking-tight flex items-center gap-2">
            <span>Biomedical Compendium & Clinical Grounding</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Evidence-Based
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Empirical foundations, human clinical trials, and polymer pathophysiology governing micro- and nanoplastic hemoclearance.
          </p>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'evidence'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Clinical Trials
          </button>
          <button
            onClick={() => setActiveTab('polymers')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'polymers'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Dna className="w-3.5 h-3.5" />
            Polymer Pathology
          </button>
          <button
            onClick={() => setActiveTab('mechanisms')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'mechanisms'
                ? 'bg-slate-800 text-cyan-300 shadow-sm border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Clearance Comparison
          </button>
        </div>
      </div>

      {/* Tab 1: Clinical Studies */}
      {activeTab === 'evidence' && (
        <div className="mt-5 space-y-4">
          {CLINICAL_STUDIES.map((study, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex flex-wrap items-start justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div>
                  <h3 className="text-sm font-semibold text-slate-100 font-display">
                    {study.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1">
                    <span>{study.authors}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-cyan-400">{study.journal}</span>
                    <span aria-hidden="true">·</span>
                    <span>{study.year}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                  <span>DOI: {study.doi}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
              </div>

              <div className="mt-3 text-xs leading-relaxed space-y-2">
                <div>
                  <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider block mb-0.5">
                    Primary Human Empirical Finding:
                  </span>
                  <p className="text-slate-300">{study.finding}</p>
                </div>
                <div className="p-2.5 bg-slate-900/60 rounded border border-slate-800/80">
                  <span className="font-mono text-[11px] text-cyan-400 uppercase tracking-wider block mb-0.5">
                    Therapeutic & Apheresis Significance:
                  </span>
                  <p className="text-slate-300 text-[11px]">{study.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Polymer Pathology Explorer */}
      {activeTab === 'polymers' && (
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Polymer Selector List */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Detected Blood Polymers
            </span>
            {Object.values(POLYMER_REGISTRY).map((poly) => (
              <button
                key={poly.id}
                onClick={() => setSelectedPolymerKey(poly.id)}
                className={`w-full p-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                  selectedPolymerKey === poly.id
                    ? 'bg-slate-800 border-cyan-500 text-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="font-semibold text-xs text-slate-200">{poly.name}</div>
                  <div className="text-[10px] font-mono text-slate-500">{poly.id} · {poly.chemicalFormula}</div>
                </div>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: poly.colorHex }}
                />
              </button>
            ))}
          </div>

          {/* Selected Polymer Deep-Dive */}
          <div className="lg:col-span-2 p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-semibold text-slate-100 font-display">
                  {selectedPolymer.name} ({selectedPolymer.id})
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Formula: {selectedPolymer.chemicalFormula} · Mean In-Vivo Size: ~{selectedPolymer.meanBloodDiameterNm} nm
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{selectedPolymer.toxicityRisk} Vascular Hazard</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Density</span>
                <span className="text-sm font-bold font-mono text-slate-200">
                  {selectedPolymer.densityGcm3} g/cm³
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Blood plasma: ~1.025 g/cm³
                </span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Acoustic Factor (Φ)</span>
                <span className="text-sm font-bold font-mono text-cyan-300">
                  {selectedPolymer.acousticContrastFactor.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  {selectedPolymer.acousticContrastFactor > 0 ? 'Nodal focus' : 'Antinodal focus'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">FTIR Raman Peak</span>
                <span className="text-sm font-bold font-mono text-amber-300">
                  {selectedPolymer.ftirMainPeakCm} cm⁻¹
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Optical fingerprint band
                </span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                Common Environmental Ingestion & Inhalation Sources:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedPolymer.commonSources.map((src, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 bg-slate-900 rounded border border-slate-800 text-slate-300 font-mono text-[11px]"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 text-xs">
              <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
                Cardiovascular & Endothelial Pathology:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedPolymer.pathologyImpact}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Mechanisms Comparison Matrix */}
      {activeTab === 'mechanisms' && (
        <div className="mt-5 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 border border-slate-800 rounded-lg">
              <thead className="bg-slate-950 font-mono text-[11px] text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Modality</th>
                  <th className="py-2.5 px-3">Target Size Range</th>
                  <th className="py-2.5 px-3">Extraction Principle</th>
                  <th className="py-2.5 px-3">Cell Preservation</th>
                  <th className="py-2.5 px-3">Protein Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                <tr className="bg-slate-900/50">
                  <td className="py-2.5 px-3 font-semibold text-cyan-300">
                    Acoustophoresis (Stage 1)
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">5 µm – 100 µm</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    Ultrasonic standing wave radiation force (F_rad) separation
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400">99.8% (Zero shear lysis)</td>
                  <td className="py-2.5 px-3 text-emerald-400">100% (No membrane contact)</td>
                </tr>

                <tr className="bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-cyan-300">
                    Biofunctionalized SPIONs (Stage 2)
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">100 nm – 2 µm</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    Hydrophobic corona binding + High-Gradient Magnetic Filter (1.8 T)
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400">99.4% (Passes through intact)</td>
                  <td className="py-2.5 px-3 text-emerald-400">&gt;97% (Preserves albumin)</td>
                </tr>

                <tr className="bg-slate-900/50">
                  <td className="py-2.5 px-3 font-semibold text-cyan-300">
                    MIP Hydrogel Cartridge (Stage 3)
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">10 nm – 100 nm</td>
                  <td className="py-2.5 px-3 text-slate-400">
                    Molecularly Imprinted crosslinked hydrogel cavity sorption
                  </td>
                  <td className="py-2.5 px-3 text-emerald-400">99.1% (No cell entrapment)</td>
                  <td className="py-2.5 px-3 text-amber-400">&gt;95% (Minimal albumin loss)</td>
                </tr>

                <tr className="bg-slate-950/40 text-slate-500">
                  <td className="py-2.5 px-3 font-semibold text-slate-400">
                    Conventional Hemodialysis (Why it fails)
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">&lt; 5 nm solutes</td>
                  <td className="py-2.5 px-3 text-slate-500">
                    Diffusion across synthetic polysulfone membrane
                  </td>
                  <td className="py-2.5 px-3 text-amber-400">98%</td>
                  <td className="py-2.5 px-3 text-rose-400">
                    Fails: Hydrophobic plastics foul pores; can't filter 20nm–50µm particles
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">The Biophysical Challenge:</strong> Red blood cells are 6–8 µm in diameter, while albumin is 7 nm. Standard dialysis membranes cannot distinguish synthetic nanoplastics (10–1000 nm) from blood components and suffer immediate severe protein-corona fouling. The HemoPure 3-stage synergy uses physical force fields (acoustic radiation + magnetic gradients + molecular hydrogels) that remove synthetic polymers without mechanical pore obstruction.
          </div>
        </div>
      )}
    </div>
  );
};
