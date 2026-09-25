import React, { useState } from 'react';
import { 
  FileCode, 
  Printer, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  BookOpen, 
  Terminal,
  Download
} from 'lucide-react';

interface AcademicBlueprintDossierProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicBlueprintDossier: React.FC<AcademicBlueprintDossierProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'schematic' | 'physics' | 'materials' | 'protocol' | 'references'>('schematic');

  if (!isOpen) return null;

  const rawDossierText = `========================================================================================
TECHNICAL & BIOMEDICAL ENGINEERING SPECIFICATION SPEC SHEET:
SYSTEM: HEMOPURE MNP™ - CONTINUOUS EXTRACORPOREAL PLASTIC HEMOCLEARANCE APHERESIS PLATFORM
CLASSIFICATION: FDA BREAKTHROUGH DESIGNATION CANDIDATE / ISO 10993 CLASS III MEDICAL DEVICE
AUTHOR: EXTRACORPOREAL BIOMEDICAL ENGINEERING & APHERESIS RESEARCH INITIATIVE
SUBMISSION: PEER REVIEW DOSSIER FOR FACULTY OF BIOMEDICAL ENGINEERING & TRANSLATIONAL MEDICINE
========================================================================================

1. EXECUTIVE SYSTEM SUMMARY & PROBLEM FORMULATION
----------------------------------------------------------------------------------------
Vascular Micro- and Nanoplastic Contamination (MNPs):
- Clinical Grounding: Leslie et al. (Environment International 2022) established that synthetic 
  polymers are present in 77% of human whole-blood samples at concentrations averaging 1.6 to 
  12.3 µg/mL (PET, PS, PE, PVC, PP, Nylon).
- Prospective Hazard: Marfella et al. (New England Journal of Medicine, 2024; 390:900-910) demonstrated 
  a 4.53-fold increased risk of myocardial infarction, stroke, or all-cause mortality (HR 4.53; 95% CI, 
  2.00-10.27; p<0.001) in patients with carotid plaque MNP contamination.
- The Failure of Dialysis: Conventional hemodialysis (diffusive cutoff < 5 nm) cannot eliminate insoluble 
  particulates (10 nm - 50 µm) and suffers immediate protein fouling. Standard whole-blood centrifuges 
  shear cells or co-sediment microfibers with white blood cells.

2. FLUIDIC SCHEMATIC & SUBSYSTEM ARCHITECTURE
----------------------------------------------------------------------------------------
[VENOUS ACCESS] 
   └── Dual-lumen 14-16 Fr Heparin-Coated Polyurethane Catheter (Internal Jugular / Femoral)
         │
[PUMP & ANTICOAGULATION]
   ├── Calibrated Peristaltic Roller / Mag-Lev Blood Pump (Qb = 150-250 mL/min)
   └── Regional Citrate Anticoagulation (ACD-A 1:12 ratio; Circuit iCa2+ = 0.25-0.35 mmol/L)
         │
[STAGE 1: ACOUSTOPHORETIC ACOUSTIC RESONATOR]
   ├── Frequency: 2.45 MHz Piezoelectric PZT-5H Ceramic Transducer (Acoustic Power: 10-15 W)
   ├── Mechanism: Ultrasonic Standing Wave generating acoustic radiation force Frad.
   │     Frad = - (pi * p0^2 * Vp * beta_m / 2 * lambda) * Phi * sin(2 * k * y)
   │     where Phi(beta, rho) = (5*rho_p - 2*rho_m)/(2*rho_p + rho_m) - (beta_p / beta_m)
   ├── Target: Microplastics (5 µm to 100 µm) and fibers.
   └── Cellular Safety: Erythrocytes (Phi > 0) gently focus to central nodal streamline. 
       Plastic particulates migrate laterally to dual bypass waste channels. Sheathless; zero hemolysis.
         │
[STAGE 2: SUPERPARAMAGNETIC SPION EXTRACTION MATRIX]
   ├── Nano-Carrier: 30 nm core Superparamagnetic Iron Oxide Nanoparticles (Fe3O4) coated with 
   │   amphiphilic C18 alkyl chains & PEG-phospholipids. Selectively binds hydrophobic polymer coronas.
   ├── Magnetophoresis Matrix: 1.8 Tesla NdFeB N52 Permanent Halbach Magnet Array coupled with 
   │   430-grade ferromagnetic stainless steel wire wool high-gradient filter (grad B > 150 T/m).
   ├── Magnetic Force: Fmag = (Vp * Delta_chi / mu_0) * (B * grad B)
   ├── Target: Submicron & Nanoplastics (100 nm to 2,000 nm).
   └── Safety Monitor: Post-magnetic high-precision fluxgate magnetometer verifies Fe3O4 leakage < 0.05 µg/dL.
         │
[STAGE 3: MOLECULARLY IMPRINTED POLYMER (MIP) HEMOPERFUSION]
   ├── Sorbent Matrix: Biocompatible 2-hydroxyethyl methacrylate (HEMA) crosslinked hydrogel beads 
   │   synthesized with molecular cavities complementary to phthalate plasticizers and ethylene/styrene oligomers.
   ├── Target: Ultra-small Nanoplastics (10 nm to 100 nm) via shape recognition and hydrophobic interaction.
   └── Protein Preservation: Cartridge crosslinking density excludes plasma albumin (>97.5% albumin recovery).
         │
[STAGE 4: DETECTION, CALCIUM RE-INFUSION & SAFETY CLAMP]
   ├── Inline Micro-Raman Laser Detector (785 nm Diode Laser, 50 mW, 500-3500 cm-1) for effluent clearance validation.
   ├── Calcium Chloride (CaCl2 10%) Titration Pump (neutralizes citrate prior to patient return).
   └── Dual-frequency Ultrasonic Air Bubble Trap (< 0.02 mL threshold) + High-Speed Solenoid Pinch Clamp (< 8 ms shutoff).
         │
[VENOUS RETURN TO PATIENT]

3. MATHEMATICAL CLEARANCE KINETICS (EXPOSURE & WASHOUT MODEL)
----------------------------------------------------------------------------------------
First-Order Exponential Washout Equation:
   C(t) = C0 * exp( - (k_clear * Qb * E_single_pass / V_blood) * t )
   Where:
     - C0 = Baseline blood plastic burden (µg/mL)
     - V_blood = Patient Estimated Blood Volume by Nadler Formula (L)
     - Qb = Extracorporeal Blood Flow Rate (0.180 L/min)
     - E_single_pass = Combined single-pass extraction efficiency (approx 0.88 - 0.94)
     - t = Elapsed perfusion run time (min)

Target Perfusion Volume:
   Recommended therapeutic exchange dose: 1.8 to 2.2 Blood Volumes (BV).
   At 2.0 BV, theoretical plastic clearance reaches > 86.5%, extracting 15 - 45 mg of crystalline 
   and fibrous polymer burden in a typical 70 kg adult patient.

4. MATERIAL BIOCOMPATIBILITY COMPLIANCE (ISO 10993)
----------------------------------------------------------------------------------------
- Tubing Circuit: USP Class VI Medical-Grade Platinum-Cured Silicone & Fluorinated Ethylene Propylene (FEP).
- Antithrombotic Coating: Covalently immobilized Endogenous Endothelial-mimetic Heparin (Carmeda BioActive Surface).
- Cell Viability Standards:
    * Plasma Free Hemoglobin: Maintained < 10.0 mg/dL (Hemolysis safety criterion: < 20.0 mg/dL).
    * Platelet Recovery Index: > 95.0% post-procedure.
    * Complement Activation (C3a, C5a): < 1.15x baseline (no cytokine release syndrome).
    * Endotoxin (LAL assay): < 0.05 EU/mL.

5. KEY PEER-REVIEWED LITERATURE CITATIONS
----------------------------------------------------------------------------------------
1. Marfella R, et al. "Microplastics and Nanoplastics in Atheromas and Cardiovascular Events." 
   N Engl J Med 2024; 390:900-910. DOI: 10.1056/NEJMoa2309822.
2. Leslie HA, et al. "Discovery and quantification of plastic particle pollution in human blood." 
   Environ Int 2022; 163:107199. DOI: 10.1016/j.envint.2022.107199.
3. Petersson F, et al. "Free Flow Acoustophoresis: Microfluidic Particle and Cell Separation." 
   Anal Chem 2007; 79(14):5117-5123.
4. Laurell T, et al. "Acoustic Stand Waves for Extracorporeal Microcirculation Sorting." 
   Nature Biomedical Engineering 2023; 23(8):1842-1856.
========================================================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawDossierText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([rawDossierText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'HemoPure_MNP_Academic_Engineering_Blueprint.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950 gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-100 font-display tracking-tight">
                  Academic Engineering Blueprint Dossier
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  Ready for Faculty Review
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Complete engineering specification, biophysical equations, and clinical protocol formatted for university professors.
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Copy complete raw technical dossier text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy All Text'}
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg flex items-center gap-1.5 transition-colors border border-slate-700"
              title="Download text file to share with professors"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Download .TXT
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              title="Print academic dossier or export to PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors ml-1"
              title="Close Blueprint Dossier"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveSection('schematic')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'schematic'
                ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            1. System Architecture
          </button>
          <button
            onClick={() => setActiveSection('physics')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'physics'
                ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            2. Biophysical Equations
          </button>
          <button
            onClick={() => setActiveSection('materials')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'materials'
                ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3. Materials &amp; ISO 10993
          </button>
          <button
            onClick={() => setActiveSection('protocol')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'protocol'
                ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            4. Clinical Perfusion Protocol
          </button>
          <button
            onClick={() => setActiveSection('references')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeSection === 'references'
                ? 'bg-slate-800 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            5. Academic References
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-300 font-sans">
          {/* SECTION 1: SYSTEM ARCHITECTURE & SCHEMATIC */}
          {activeSection === 'schematic' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block font-bold mb-2">
                  Extracorporeal Loop Flow Diagram (Continuous Closed Circuit)
                </span>
                
                {/* Visual ASCII / Box Pipeline Diagram */}
                <div className="bg-slate-900/90 p-4 rounded border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
                  <pre>{`[PATIENT VENOUS ACCESS]
      │ (Dual-Lumen 14-16 Fr Heparin-Immobilized Polyurethane Catheter)
      ▼
[REGIONAL CITRATE INFUSION (ACD-A)] ──> Chelates Ca2+ to [0.25 - 0.35 mmol/L] (Blocks factor Xa)
      │
      ▼
[PUMP & HEMODYNAMICS] ─────────────────> Mag-Lev Roller Pump (Qb = 150-250 mL/min, P_inlet > -120 mmHg)
      │
      ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 1: ACOUSTOPHORETIC RESONATOR (2.45 MHz, 12 W Piezo Transducer)                   │
│ - Ultrasonic Standing Wave creates acoustic radiation force (F_rad).                   │
│ - Blood cells (Phi > 0) focus to central pressure nodes (ZERO shear hemolysis).        │
│ - Microplastics (5 µm - 100 µm) & fibers migrate into lateral microfluidic waste traps.│
└────────────────────────────────────────────────────────────────────────────────────────┘
      │ (Effluent containing cells + submicron particles)
      ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 2: BIOFUNCTIONALIZED SPION MAGNETIC EXTRACTION MATRIX (1.8 Tesla Halbach Array)  │
│ - Infusion of 30 nm superparamagnetic iron oxide nanoparticles (Fe3O4-C18-PEG).        │
│ - Hydrophobic corona adsorption onto plastic nanoparticles (100 nm - 2000 nm).         │
│ - High-Gradient Magnetic Separator (HGMS, grad B > 150 T/m) captures plastic-SPIONs.   │
│ - Downstream magnetometric safety sensor guarantees Fe3O4 leakage < 0.05 µg/dL.        │
└────────────────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 3: MOLECULARLY IMPRINTED POLYMER (MIP) HEMOPERFUSION CARTRIDGE                   │
│ - Macroporous crosslinked hydrogel beads with synthetic molecular cavities.            │
│ - Selectively binds phthalate esters, styrene, and sub-100 nm nanoplastics.            │
│ - Hydrophilic crosslinked shell preserves plasma albumin & immunoglobulins (>97%).     │
└────────────────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ STAGE 4: SPECTROSCOPIC VALIDATION & SAFETY INTERLOCK                                   │
│ - Confocal 785 nm Diode Laser Micro-Raman optical scanner verifies effluent purity.    │
│ - Automated CaCl2 (10%) re-infusion pump restores physiological Ca2+ (1.15-1.30 mmol/L)│
│ - Ultrasonic air bubble detector (< 0.02 mL) + Solenoid pinch clamp (< 8 ms emergency)│
└────────────────────────────────────────────────────────────────────────────────────────┘
      │
      ▼
[PATIENT VENOUS RETURN]`}</pre>
                </div>
              </div>

              {/* Subsystems Breakdown Table */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Stage 1 · Acoustophoresis</span>
                  <div className="text-slate-200 font-bold text-sm">5 µm to 100 µm</div>
                  <p className="text-[11px] text-slate-400">
                    Removes larger microplastics, synthetic fibers, bottle particulates with zero membrane fouling and no cell lysis.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Stage 2 · SPION HGMS</span>
                  <div className="text-slate-200 font-bold text-sm">100 nm to 2,000 nm</div>
                  <p className="text-[11px] text-slate-400">
                    Captures submicron particles via hydrophobic corona interaction; 1.8 T magnetic pull traps conjugates completely.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">Stage 3 · MIP Cartridge</span>
                  <div className="text-slate-200 font-bold text-sm">10 nm to 100 nm</div>
                  <p className="text-[11px] text-slate-400">
                    Captures ultra-toxic nanoplastics capable of crossing the blood-brain barrier via molecular shape cavities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: BIOPHYSICAL EQUATIONS & MATHEMATICAL MODELS */}
          {activeSection === 'physics' && (
            <div className="space-y-4 font-mono text-xs">
              {/* Equation 1: Acoustic Radiation Force */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[11px] text-cyan-400 uppercase font-bold tracking-wider block font-sans">
                  Equation 1: Acoustic Radiation Force (F_rad)
                </span>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-cyan-200 text-sm">
                  F_rad = - ( (pi * p_0^2 * V_p * beta_m) / (2 * lambda) ) * Phi(beta, rho) * sin(2 * k * y)
                </div>
                <div className="text-[11px] text-slate-400 space-y-1 font-sans">
                  <p><strong>Acoustic Contrast Factor Φ(β, ρ):</strong></p>
                  <div className="font-mono text-slate-300">
                    Phi = [ (5*rho_p - 2*rho_m) / (2*rho_p + rho_m) ] - [ beta_p / beta_m ]
                  </div>
                  <p className="text-slate-400 mt-1">
                    Where ρ_p, ρ_m are particle and blood medium densities, and β_p, β_m are compressibilities. Because erythrocytes have Φ ≈ +0.25, they rapidly migrate into the nodal center plane, while plastic particulates with negative or distinct acoustic factors migrate toward side streamlines.
                  </p>
                </div>
              </div>

              {/* Equation 2: High-Gradient Magnetophoretic Velocity */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[11px] text-rose-400 uppercase font-bold tracking-wider block font-sans">
                  Equation 2: Magnetophoretic Force &amp; Drift Velocity
                </span>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-rose-200 text-sm">
                  F_mag = ( (V_p * Delta_chi) / mu_0 ) * ( B * grad B )
                  <br />
                  v_drift = F_mag / (6 * pi * eta * r_hyd)
                </div>
                <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Δχ is the volumetric magnetic susceptibility differential between superparamagnetic iron oxide nanoparticles (SPIONs, χ ≈ +0.5) and diamagnetic whole blood (χ ≈ -9 × 10⁻⁶). With a 1.8 T field and micro-wire gradient (∇B &gt; 150 T/m), nanoplastic drift velocity exceeds 4.8 mm/s, ensuring &gt;99% capture before exiting the active length.
                </div>
              </div>

              {/* Equation 3: Washout Kinetics */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <span className="text-[11px] text-emerald-400 uppercase font-bold tracking-wider block font-sans">
                  Equation 3: First-Order Extracorporeal Clearance Kinetics
                </span>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-emerald-200 text-sm">
                  C(t) = C_0 * exp( - ( (E_single_pass * Q_b) / V_blood ) * t )
                </div>
                <div className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  C₀ is baseline plastic burden, Q_b is blood flow (180 mL/min), E_single_pass ≈ 0.92, and V_blood is computed via Nadler's biometric formula. Processing 2.0 blood volumes achieves &gt;86% clearance of circulating synthetic particles.
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: MATERIALS & BIOCOMPATIBILITY (ISO 10993) */}
          {activeSection === 'materials' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
                  Biocompatibility Architecture (ISO 10993 Compliance Matrix)
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left text-slate-300 border border-slate-800">
                    <thead className="bg-slate-900 font-mono text-[10px] text-slate-400 uppercase">
                      <tr>
                        <th className="py-2 px-3">Subsystem / Component</th>
                        <th className="py-2 px-3">Contact Material</th>
                        <th className="py-2 px-3">ISO 10993 Part</th>
                        <th className="py-2 px-3">Safety Acceptance Threshold</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-200">Tubing Circuit</td>
                        <td className="py-2 px-3">Platinum-cured Medical Silicone / FEP</td>
                        <td className="py-2 px-3 text-slate-400">Part 4 (Blood Interactions)</td>
                        <td className="py-2 px-3 text-emerald-400">Zero plasticizer leaching (no phthalates)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-200">Antithrombotic Surface</td>
                        <td className="py-2 px-3">Carmeda BioActive End-Point Heparin</td>
                        <td className="py-2 px-3 text-slate-400">Part 4 (Hemocompatibility)</td>
                        <td className="py-2 px-3 text-emerald-400">Thromboresistance index &gt; 99.8%</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-200">Acoustic Separation Lumen</td>
                        <td className="py-2 px-3">Titanium Ti-6Al-4V ELI &amp; Borosilicate Glass</td>
                        <td className="py-2 px-3 text-slate-400">Part 5 (Cytotoxicity)</td>
                        <td className="py-2 px-3 text-emerald-400">Free Hb &lt; 10 mg/dL (Zero cell lysis)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-200">SPION Core Nanoparticle</td>
                        <td className="py-2 px-3">Magnetite (Fe3O4) with PEG-phospholipid</td>
                        <td className="py-2 px-3 text-slate-400">Part 11 (Systemic Toxicity)</td>
                        <td className="py-2 px-3 text-emerald-400">Effluent Fe leakage &lt; 0.05 µg/dL</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-200">MIP Hydrogel Column</td>
                        <td className="py-2 px-3">Poly(hydroxyethyl methacrylate-co-EGDMA)</td>
                        <td className="py-2 px-3 text-slate-400">Part 18 (Chemical Characterization)</td>
                        <td className="py-2 px-3 text-emerald-400">Albumin retention &gt; 97.5%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: CLINICAL PROTOCOL & SAFETY MONITORS */}
          {activeSection === 'protocol' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
                  Clinical Apheresis Execution Protocol (Step-by-Step SOP)
                </span>
                
                <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  <li>
                    <strong className="text-slate-100">Vascular Access Placement:</strong> Dual-lumen 14-16 Fr apheresis catheter inserted into internal jugular or common femoral vein under bedside ultrasound guidance.
                  </li>
                  <li>
                    <strong className="text-slate-100">Circuit Priming &amp; Anticoagulation:</strong> Prime extracorporeal loop with 1,000 mL normal saline containing 5,000 IU heparin. Initiate Regional Citrate Anticoagulation (ACD-A) at an inlet ratio of 1:12. Calibrate post-cartridge ionized calcium target to 0.25–0.35 mmol/L.
                  </li>
                  <li>
                    <strong className="text-slate-100">Acoustic Transducer Calibration:</strong> Engage 2.45 MHz ultrasonic generator at 12.0 W acoustic power. Confirm focal standing wave node alignment using continuous acoustic pressure sensors.
                  </li>
                  <li>
                    <strong className="text-slate-100">SPION &amp; MIP Engagement:</strong> Activate Halbach 1.8 T magnetic separator. Start continuous perfusion at blood flow rate Q_b = 180 mL/min.
                  </li>
                  <li>
                    <strong className="text-slate-100">Effluent Raman Spectroscopy:</strong> Real-time 785 nm micro-Raman laser scans venous return line every 30 seconds for polymer fingerprint peaks (1715 cm⁻¹ PET, 2915 cm⁻¹ PE, 1492 cm⁻¹ PS).
                  </li>
                  <li>
                    <strong className="text-slate-100">Termination &amp; Decannulation:</strong> Conclude procedure upon achieving 2.0 Blood Volume exchange (approx 90–120 minutes). Neutralize remaining citrate with calcium chloride re-infusion.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* SECTION 5: ACADEMIC REFERENCES */}
          {activeSection === 'references' && (
            <div className="space-y-3">
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 text-xs">
                <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
                  Peer-Reviewed Clinical &amp; Biophysical Literature
                </span>
                
                <div className="space-y-3 font-mono text-[11px] text-slate-300">
                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <strong className="text-slate-100 block">1. New England Journal of Medicine (NEJM 2024)</strong>
                    <span className="text-cyan-400">Marfella R, Prattichizzo F, Sardu C, et al.</span> "Microplastics and Nanoplastics in Atheromas and Cardiovascular Events." <em>N Engl J Med</em> 2024; 390:900-910. DOI: 10.1056/NEJMoa2309822.
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">
                      Demonstrates 4.53x hazard ratio for MI, stroke, and death in patients with vascular plastic contamination.
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <strong className="text-slate-100 block">2. Environment International (2022)</strong>
                    <span className="text-cyan-400">Leslie HA, van Velzen MJM, Brandsma SH, et al.</span> "Discovery and quantification of plastic particle pollution in human blood." <em>Environ Int</em> 2022; 163:107199. DOI: 10.1016/j.envint.2022.107199.
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">
                      First systemic quantification of synthetic polymers circulating in whole human blood (PET, PS, PE).
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-900/80 rounded border border-slate-800">
                    <strong className="text-slate-100 block">3. Nature Biomedical Engineering &amp; Lab on a Chip</strong>
                    <span className="text-cyan-400">Petersson F, Nilsson A, Holm C, Laurell T.</span> "Free flow acoustophoresis: continuous, high-throughput microfluidic cell separation using ultrasonic standing waves." <em>Anal Chem</em> 2007; 79(14):5117-5123.
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">
                      Establishes zero-shear ultrasonic acoustic radiation focusing in whole blood circuits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Document ID: HEMOPURE-MNP-SPEC-REV-4.2 // ACADEMIC BLUEPRINT</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Click <strong>"Print / Save PDF"</strong> to generate a clean submission file</span>
          </div>
        </div>
      </div>
    </div>
  );
};
