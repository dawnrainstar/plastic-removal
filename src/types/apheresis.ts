export type PolymerType = 'PET' | 'PS' | 'PE' | 'PVC' | 'PP' | 'Nylon';

export interface PolymerData {
  id: PolymerType;
  name: string;
  chemicalFormula: string;
  commonSources: string[];
  densityGcm3: number;
  acousticContrastFactor: number; // phi value in blood
  meanBloodDiameterNm: number;
  toxicityRisk: 'High' | 'Severe' | 'Moderate';
  pathologyImpact: string;
  ftirMainPeakCm: number;
  colorHex: string;
}

export interface BloodParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'RBC' | 'Platelet' | 'WBC' | 'Plastic';
  polymer?: PolymerType;
  shape?: 'disc' | 'sphere' | 'shard' | 'fiber';
  rotation: number;
  vRot: number;
  aspectRatio: number;
  boundToSpion: boolean;
  cleared: boolean;
  clearanceStage?: 1 | 2 | 3;
  sizeNm: number;
  surfaceChargeMv: number;
  opacity: number;
}

export type ApheresisStage = 'all' | 'acoustic' | 'magnetic' | 'hemoperfusion' | 'spectroscopy';

export interface ApheresisTelemetry {
  bloodFlowRateMlMin: number; // 150-250
  totalBloodProcessedL: number;
  bloodVolumesProcessed: number;
  sessionTimeSec: number;
  baselinePlasticUgMl: number;
  currentPlasticUgMl: number;
  totalPlasticRemovedMg: number;
  overallClearancePercent: number;
  hematocritPct: number; // normal 38-45%
  freeHemoglobinMgDl: number; // normal < 10 mg/dL (safety threshold < 30)
  plateletRecoveryPct: number; // normal > 95%
  transmembranePressureMmHg: number; // normal 40-120
  magneticFieldTesla: number; // 1.8 T
  ultrasonicPowerW: number; // 12 W
  bubbleDetected: boolean;
  anticoagulantInfusionMlHr: number;
}

export interface PatientProfile {
  patientId: string;
  weightKg: number;
  heightCm: number;
  gender: 'Female' | 'Male';
  hematocritBaseline: number;
  estimatedBloodVolumeL: number;
  baselineBurdenUgMl: number;
  dominantPolymer: PolymerType;
  anticoagulant: 'ACD-A Citrate' | 'Unfractionated Heparin' | 'Bivalirudin';
  targetBloodVolumes: number; // 1.5 to 2.5
}

export interface ClinicalLogEntry {
  timestamp: string;
  elapsedMinutes: number;
  volumeProcessedL: number;
  plasticConcentrationUgMl: number;
  clearanceEfficiencyPct: number;
  freeHemoglobinMgDl: number;
  note: string;
}
