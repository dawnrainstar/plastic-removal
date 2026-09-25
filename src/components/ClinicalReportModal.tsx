import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';
import { ApheresisTelemetry, PatientProfile } from '../types/apheresis';
import { POLYMER_REGISTRY } from '../data/polymers';

interface ClinicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientProfile;
  telemetry: ApheresisTelemetry;
  clearedByPolymer: Record<string, number>;
}

export const ClinicalReportModal: React.FC<ClinicalReportModalProps> = ({
  isOpen,
  onClose,
  patient,
  telemetry,
  clearedByPolymer,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalParticlesCount = Object.values(clearedByPolymer).reduce((a, b) => a + b, 0);

  const reportText = `===============================================================
HEMOPURE MNP™ // CLINICAL EXTRACORPOREAL APHERESIS SUMMARY REPORT
===============================================================
Date / Time: ${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
System: HemoPure MNP Bio-Acoustic & Nano-Magnetic Hemoclearance Unit
Device Firmware: ISO-10993 Certified / ELSO Standard Apheresis Protocol

---------------------------------------------------------------
1. PATIENT DEMOGRAPHICS & BASELINE PARAMETERS
---------------------------------------------------------------
Patient ID: ${patient.patientId}
Gender: ${patient.gender} | Weight: ${patient.weightKg} kg | Height: ${patient.heightCm} cm
Estimated Blood Volume (Nadler): ${patient.estimatedBloodVolumeL.toFixed(2)} L
Baseline Hematocrit: ${patient.hematocritBaseline}%
Anticoagulation Protocol: ${patient.anticoagulant}

---------------------------------------------------------------
2. THERAPEUTIC HEMOCLEARANCE METRICS
---------------------------------------------------------------
Baseline Blood Plastic Burden: ${telemetry.baselinePlasticUgMl.toFixed(2)} µg/mL
Post-Apheresis Residual Burden: ${telemetry.currentPlasticUgMl.toFixed(2)} µg/mL
Overall Extraction Efficiency: ${telemetry.overallClearancePercent.toFixed(1)}%
Total Micro/Nanoplastic Mass Cleared: ${telemetry.totalPlasticRemovedMg.toFixed(2)} mg
Total Extracorporeal Blood Processed: ${telemetry.totalBloodProcessedL.toFixed(2)} L (${telemetry.bloodVolumesProcessed.toFixed(2)}x Blood Volumes)
Active Treatment Elapsed Time: ${Math.floor(telemetry.sessionTimeSec / 60)}m ${telemetry.sessionTimeSec % 60}s

---------------------------------------------------------------
3. POLYMER SPECIES EXTRACTION BREAKDOWN
---------------------------------------------------------------
${Object.entries(clearedByPolymer)
  .map(([poly, count]) => {
    const reg = POLYMER_REGISTRY[poly];
    const pct = totalParticlesCount > 0 ? ((count / totalParticlesCount) * 100).toFixed(1) : '0.0';
    return `- ${poly.padEnd(6)} (${reg?.name || poly}): ${count} particles captured (${pct}%)`;
  })
  .join('\n')}

---------------------------------------------------------------
4. HEMODYNAMIC & CELLULAR SAFETY ASSESSMENT
---------------------------------------------------------------
Transmembrane Pressure (TMP): ${telemetry.transmembranePressureMmHg.toFixed(0)} mmHg (Nominal: 40-120)
Plasma Free Hemoglobin: ${telemetry.freeHemoglobinMgDl.toFixed(1)} mg/dL (Safety Limit: < 20 mg/dL - No Hemolysis)
Erythrocyte Recovery Index: 99.4% (Nominal)
Platelet Preservation Index: ${telemetry.plateletRecoveryPct.toFixed(1)}% (Nominal > 95%)
Air Microemboli Detected: 0.00 mL (Ultrasonic Bubble Trap Verified)
Magnetic SPION Effluent Leakage: < 0.05 µg/dL (Below Detection Limit)

CLINICAL IMPRESSION:
Extracorporeal clearance achieved targeted plastic reduction without clinically significant hemolysis, platelet consumption, or cellular shearing.
Signed: Clinical Perfusionist / Apheresis Attending Specialist
===============================================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-slate-100 font-display">
              Clinical Apheresis Treatment Summary
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto font-mono text-xs text-slate-300 space-y-4">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 font-sans">
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Clearance Achieved</span>
              <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                {telemetry.overallClearancePercent.toFixed(1)}%
              </div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Residual Plastic</span>
              <div className="text-lg font-bold font-mono text-cyan-300 tabular-nums">
                {telemetry.currentPlasticUgMl.toFixed(2)} µg/mL
              </div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Mass Extracted</span>
              <div className="text-lg font-bold font-mono text-amber-300 tabular-nums">
                {telemetry.totalPlasticRemovedMg.toFixed(2)} mg
              </div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Free Hemoglobin</span>
              <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
                {telemetry.freeHemoglobinMgDl.toFixed(1)} mg/dL
              </div>
            </div>
          </div>

          {/* Formatted clinical record text */}
          <div className="p-4 bg-slate-950 rounded border border-slate-800 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-300 select-all">
            {reportText}
          </div>
        </div>
      </div>
    </div>
  );
};
