/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { TelemetryBar } from './components/TelemetryBar';
import { SimulationCanvas } from './components/SimulationCanvas';
import { ControlsColumn } from './components/ControlsColumn';
import { KineticsTray } from './components/KineticsTray';
import { ParticleInspector } from './components/ParticleInspector';
import { CircuitArchitecture } from './components/CircuitArchitecture';
import { PatientProtocolCalculator } from './components/PatientProtocolCalculator';
import { ScientificCompendium } from './components/ScientificCompendium';
import { ClinicalReportModal } from './components/ClinicalReportModal';
import { ExecutiveExplainer } from './components/ExecutiveExplainer';
import { AcademicBlueprintDossier } from './components/AcademicBlueprintDossier';
import { OfflineBanner } from './components/PWAInstallButton';

import {
  ApheresisTelemetry,
  PatientProfile,
  BloodParticle,
  PolymerType,
  ApheresisStage,
  ClinicalLogEntry,
} from './types/apheresis';

const INITIAL_PATIENT: PatientProfile = {
  patientId: 'HP-9042-M',
  weightKg: 74,
  heightCm: 178,
  gender: 'Male',
  hematocritBaseline: 42,
  estimatedBloodVolumeL: 5.14,
  baselineBurdenUgMl: 4.8,
  dominantPolymer: 'PET',
  anticoagulant: 'ACD-A Citrate',
  targetBloodVolumes: 2.0,
};

const INITIAL_TELEMETRY: ApheresisTelemetry = {
  bloodFlowRateMlMin: 180,
  totalBloodProcessedL: 0,
  bloodVolumesProcessed: 0,
  sessionTimeSec: 0,
  baselinePlasticUgMl: 4.8,
  currentPlasticUgMl: 4.8,
  totalPlasticRemovedMg: 0,
  overallClearancePercent: 0,
  hematocritPct: 41.8,
  freeHemoglobinMgDl: 4.2, // normal < 10
  plateletRecoveryPct: 98.6,
  transmembranePressureMmHg: 68,
  magneticFieldTesla: 1.8,
  ultrasonicPowerW: 12.0,
  bubbleDetected: false,
  anticoagulantInfusionMlHr: 15.0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'circuit' | 'protocol' | 'compendium'>('simulation');
  const [stage, setStage] = useState<ApheresisStage>('all');
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [patient, setPatient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [telemetry, setTelemetry] = useState<ApheresisTelemetry>(INITIAL_TELEMETRY);
  const [selectedParticle, setSelectedParticle] = useState<BloodParticle | null>(null);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState<boolean>(false);

  const [activePolymers, setActivePolymers] = useState<Record<PolymerType, boolean>>({
    PET: true,
    PS: true,
    PE: true,
    PVC: true,
    PP: true,
    Nylon: true,
  });

  const [clearedByPolymer, setClearedByPolymer] = useState<Record<string, number>>({
    PET: 0,
    PS: 0,
    PE: 0,
    PVC: 0,
    PP: 0,
    Nylon: 0,
  });

  const [clinicalLogs, setClinicalLogs] = useState<ClinicalLogEntry[]>([
    {
      timestamp: '00:00',
      elapsedMinutes: 0,
      volumeProcessedL: 0,
      plasticConcentrationUgMl: 4.8,
      clearanceEfficiencyPct: 0,
      freeHemoglobinMgDl: 4.2,
      note: 'Vascular access primed. ACD-A anticoagulation initiated at 1:12 ratio.',
    },
  ]);

  // Handle particle cleared callback from simulation canvas
  const handleParticleCleared = useCallback((polymer: PolymerType, _sizeNm: number) => {
    setClearedByPolymer((prev) => ({
      ...prev,
      [polymer]: (prev[polymer] || 0) + 1,
    }));
  }, []);

  // Update telemetry and clinical logs on timer
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const nextTime = prev.sessionTimeSec + 1;
        const deltaL = (prev.bloodFlowRateMlMin / 60 / 1000) * 1.5; // Slightly accelerated time scale
        const nextTotalL = prev.totalBloodProcessedL + deltaL;
        const ebv = Math.max(1, patient.estimatedBloodVolumeL);
        const nextBvProcessed = nextTotalL / ebv;

        // Exponential decay clearance kinetics
        const kRate = (0.92 * prev.bloodFlowRateMlMin) / (ebv * 1000);
        const minutes = nextTime / 40; // 40 real sec = ~1 min equivalent
        const newConc = Math.max(0.12, prev.baselinePlasticUgMl * Math.exp(-kRate * minutes));
        const clearancePct = Math.min(
          96.5,
          ((prev.baselinePlasticUgMl - newConc) / prev.baselinePlasticUgMl) * 100
        );

        // Mass in mg: (C0 - C) ug/mL * EBV * 1000 mL / 1000 ug/mg
        const massRemovedMg = ((prev.baselinePlasticUgMl - newConc) * ebv * 1000) / 1000;

        // Minimal physiological fluctuation for hemolysis index (free hemoglobin)
        const freeHgb = Math.min(9.5, 4.2 + (nextBvProcessed * 0.4) + Math.sin(nextTime * 0.2) * 0.3);

        return {
          ...prev,
          sessionTimeSec: nextTime,
          totalBloodProcessedL: nextTotalL,
          bloodVolumesProcessed: nextBvProcessed,
          currentPlasticUgMl: newConc,
          overallClearancePercent: clearancePct,
          totalPlasticRemovedMg: massRemovedMg,
          freeHemoglobinMgDl: freeHgb,
          transmembranePressureMmHg: 68 + Math.sin(nextTime * 0.1) * 3,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, patient.estimatedBloodVolumeL]);

  // Log clinical checkpoints every 30 seconds
  useEffect(() => {
    if (!isRunning || telemetry.sessionTimeSec === 0) return;

    if (telemetry.sessionTimeSec % 30 === 0) {
      const minutes = Math.floor(telemetry.sessionTimeSec / 60);
      const seconds = telemetry.sessionTimeSec % 60;
      const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      setClinicalLogs((prev) => [
        ...prev,
        {
          timestamp: timeStr,
          elapsedMinutes: minutes,
          volumeProcessedL: telemetry.totalBloodProcessedL,
          plasticConcentrationUgMl: telemetry.currentPlasticUgMl,
          clearanceEfficiencyPct: telemetry.overallClearancePercent,
          freeHemoglobinMgDl: telemetry.freeHemoglobinMgDl,
          note: `Extracorporeal checkpoint: ${telemetry.bloodVolumesProcessed.toFixed(2)} blood volumes processed. Effluent Raman clean.`,
        },
      ]);
    }
  }, [telemetry.sessionTimeSec, isRunning]);

  // Toggle polymer filtering
  const handleTogglePolymer = (polymer: PolymerType) => {
    setActivePolymers((prev) => ({
      ...prev,
      [polymer]: !prev[polymer],
    }));
  };

  // Add acute bolus contamination challenge
  const handleAddContaminationBolus = (amountUgMl: number) => {
    setTelemetry((prev) => ({
      ...prev,
      currentPlasticUgMl: prev.currentPlasticUgMl + amountUgMl,
      baselinePlasticUgMl: prev.baselinePlasticUgMl + amountUgMl,
    }));

    setClinicalLogs((prev) => [
      ...prev,
      {
        timestamp: `${String(Math.floor(telemetry.sessionTimeSec / 60)).padStart(2, '0')}:${String(
          telemetry.sessionTimeSec % 60
        ).padStart(2, '0')}`,
        elapsedMinutes: Math.floor(telemetry.sessionTimeSec / 60),
        volumeProcessedL: telemetry.totalBloodProcessedL,
        plasticConcentrationUgMl: telemetry.currentPlasticUgMl + amountUgMl,
        clearanceEfficiencyPct: telemetry.overallClearancePercent,
        freeHemoglobinMgDl: telemetry.freeHemoglobinMgDl,
        note: `In-vitro stress spike injected (+${amountUgMl} µg/mL). Stage 1 & 2 loading increased.`,
      },
    ]);
  };

  // Reset circuit to initial calibrated state
  const handleResetCircuit = () => {
    setTelemetry(INITIAL_TELEMETRY);
    setClearedByPolymer({
      PET: 0,
      PS: 0,
      PE: 0,
      PVC: 0,
      PP: 0,
      Nylon: 0,
    });
    setClinicalLogs([
      {
        timestamp: '00:00',
        elapsedMinutes: 0,
        volumeProcessedL: 0,
        plasticConcentrationUgMl: patient.baselineBurdenUgMl,
        clearanceEfficiencyPct: 0,
        freeHemoglobinMgDl: 4.2,
        note: 'Extracorporeal circuit recalibrated. Prime volume verified.',
      },
    ]);
  };

  // Apply new dosage from protocol calculator
  const handleApplyProtocol = () => {
    setTelemetry((prev) => ({
      ...prev,
      baselinePlasticUgMl: patient.baselineBurdenUgMl,
      currentPlasticUgMl: patient.baselineBurdenUgMl,
      sessionTimeSec: 0,
      totalBloodProcessedL: 0,
      bloodVolumesProcessed: 0,
      overallClearancePercent: 0,
      totalPlasticRemovedMg: 0,
    }));
    setActiveTab('simulation');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. Header (Top Bar Contract) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isRunning={isRunning}
        onTogglePlay={() => setIsRunning(!isRunning)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
      />

      {/* 2. Top Telemetry Ribbon */}
      <TelemetryBar telemetry={telemetry} isRunning={isRunning} />

      {/* 3. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Executive Academic Explainer: How this works & Why (At the very top) */}
        <ExecutiveExplainer
          onOpenBlueprint={() => setIsBlueprintOpen(true)}
          onNavigateTab={setActiveTab}
        />
        {/* Navigation Tab: Simulation (Main Interactive Apheresis Lab) */}
        {activeTab === 'simulation' && (
          <div className="space-y-5">
            {/* Split Console: Left Controls Column + Center Simulation Canvas */}
            <div className="flex flex-col lg:flex-row gap-5">
              <ControlsColumn
                telemetry={telemetry}
                onChangeTelemetry={(updated) => setTelemetry((prev) => ({ ...prev, ...updated }))}
                activePolymers={activePolymers}
                onTogglePolymer={handleTogglePolymer}
                onAddContaminationBolus={handleAddContaminationBolus}
                onResetCircuit={handleResetCircuit}
              />

              <div className="flex-1 min-w-0 space-y-4">
                <SimulationCanvas
                  stage={stage}
                  onSelectStage={setStage}
                  isRunning={isRunning}
                  onTogglePlay={() => setIsRunning(!isRunning)}
                  flowRateMlMin={telemetry.bloodFlowRateMlMin}
                  magneticFieldTesla={telemetry.magneticFieldTesla}
                  acousticPowerW={telemetry.ultrasonicPowerW}
                  baselineUgMl={telemetry.baselinePlasticUgMl}
                  currentUgMl={telemetry.currentPlasticUgMl}
                  onParticleCleared={handleParticleCleared}
                  onSelectParticle={setSelectedParticle}
                  selectedParticle={selectedParticle}
                />

                {/* Particle Inspector Drawer/HUD */}
                {selectedParticle && (
                  <ParticleInspector
                    particle={selectedParticle}
                    onClose={() => setSelectedParticle(null)}
                  />
                )}
              </div>
            </div>

            {/* Bottom Real-time Kinetics & Safety Tray */}
            <KineticsTray
              telemetry={telemetry}
              clearedByPolymer={clearedByPolymer}
              clinicalLogs={clinicalLogs}
            />
          </div>
        )}

        {/* Navigation Tab: Circuit Architecture */}
        {activeTab === 'circuit' && (
          <CircuitArchitecture telemetry={telemetry} isRunning={isRunning} />
        )}

        {/* Navigation Tab: Patient Protocol */}
        {activeTab === 'protocol' && (
          <PatientProtocolCalculator
            patient={patient}
            onChangePatient={(updated) =>
              setPatient((prev) => {
                const next = { ...prev, ...updated };
                // Update estimated blood volume automatically
                const hM = next.heightCm / 100;
                next.estimatedBloodVolumeL =
                  next.gender === 'Male'
                    ? 0.3669 * Math.pow(hM, 3) + 0.03219 * next.weightKg + 0.6041
                    : 0.3561 * Math.pow(hM, 3) + 0.03308 * next.weightKg + 0.1833;
                return next;
              })
            }
            telemetry={telemetry}
            onApplyProtocol={handleApplyProtocol}
          />
        )}

        {/* Navigation Tab: Clinical Evidence Compendium */}
        {activeTab === 'compendium' && <ScientificCompendium />}
      </main>

      {/* Clinical Report Export Modal */}
      <ClinicalReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        patient={patient}
        telemetry={telemetry}
        clearedByPolymer={clearedByPolymer}
      />

      {/* Academic Engineering Blueprint Dossier for Faculty & Professors */}
      <AcademicBlueprintDossier
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />

      {/* Offline Connectivity Notification Banner */}
      <OfflineBanner />

      {/* Clean Scientific Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs font-mono text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span>HemoPure MNP Research Platform</span>
          <span aria-hidden="true">·</span>
          <span>Acoustophoretic & Nano-Magnetic Blood Plastic Apheresis</span>
          <span aria-hidden="true">·</span>
          <span>ISO 10993 Biocompatibility Compliant</span>
        </div>
        <div>
          <span>Extracorporeal Biomedical Research Initiative</span>
        </div>
      </footer>
    </div>
  );
}
