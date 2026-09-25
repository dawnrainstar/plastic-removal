import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Crosshair, Sparkles, Magnet, Radio, Filter, Eye } from 'lucide-react';
import { BloodParticle, PolymerType, ApheresisStage } from '../types/apheresis';
import { POLYMER_REGISTRY } from '../data/polymers';

interface SimulationCanvasProps {
  stage: ApheresisStage;
  onSelectStage: (stage: ApheresisStage) => void;
  isRunning: boolean;
  onTogglePlay: () => void;
  flowRateMlMin: number;
  magneticFieldTesla: number;
  acousticPowerW: number;
  baselineUgMl: number;
  currentUgMl: number;
  onParticleCleared: (polymer: PolymerType, sizeNm: number) => void;
  onSelectParticle: (particle: BloodParticle | null) => void;
  selectedParticle: BloodParticle | null;
}

const POLYMERS_LIST: PolymerType[] = ['PET', 'PS', 'PE', 'PVC', 'PP', 'Nylon'];

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  stage,
  onSelectStage,
  isRunning,
  onTogglePlay,
  flowRateMlMin,
  magneticFieldTesla,
  acousticPowerW,
  baselineUgMl,
  currentUgMl,
  onParticleCleared,
  onSelectParticle,
  selectedParticle,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<BloodParticle[]>([]);
  const nextIdRef = useRef<number>(1);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [showFieldOverlays, setShowFieldOverlays] = useState<boolean>(true);
  const [hoveredParticle, setHoveredParticle] = useState<BloodParticle | null>(null);

  // Initialize blood particles pool
  const initParticles = useCallback((width: number, height: number) => {
    const list: BloodParticle[] = [];
    nextIdRef.current = 1;

    // 1. Red Blood Cells (RBCs) - biconcave discs, 7-8 um
    const rbcCount = 65;
    for (let i = 0; i < rbcCount; i++) {
      list.push({
        id: nextIdRef.current++,
        x: Math.random() * width,
        y: 35 + Math.random() * (height - 70),
        vx: 1.2 + Math.random() * 0.8,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 10 + Math.random() * 3,
        type: 'RBC',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        aspectRatio: 0.45 + Math.random() * 0.25,
        boundToSpion: false,
        cleared: false,
        sizeNm: 7500,
        surfaceChargeMv: -15.2,
        opacity: 0.85 + Math.random() * 0.15,
      });
    }

    // 2. Platelets - small 2-3 um disc fragments
    const plateletCount = 18;
    for (let i = 0; i < plateletCount; i++) {
      list.push({
        id: nextIdRef.current++,
        x: Math.random() * width,
        y: 30 + Math.random() * (height - 60),
        vx: 1.4 + Math.random() * 0.9,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 3.5 + Math.random() * 1.5,
        type: 'Platelet',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.08,
        aspectRatio: 0.7,
        boundToSpion: false,
        cleared: false,
        sizeNm: 2500,
        surfaceChargeMv: -12.4,
        opacity: 0.9,
      });
    }

    // 3. White Blood Cells (WBCs) - larger spherical cells
    const wbcCount = 4;
    for (let i = 0; i < wbcCount; i++) {
      list.push({
        id: nextIdRef.current++,
        x: Math.random() * width,
        y: 40 + Math.random() * (height - 80),
        vx: 1.0 + Math.random() * 0.5,
        vy: (Math.random() - 0.5) * 0.15,
        radius: 14 + Math.random() * 3,
        type: 'WBC',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
        aspectRatio: 0.95,
        boundToSpion: false,
        cleared: false,
        sizeNm: 12000,
        surfaceChargeMv: -18.0,
        opacity: 0.9,
      });
    }

    // 4. Microplastics and Nanoplastics
    // Density proportional to current concentration
    const plasticRatio = Math.max(0.1, currentUgMl / Math.max(1, baselineUgMl));
    const plasticCount = Math.round(28 * plasticRatio);

    for (let i = 0; i < plasticCount; i++) {
      const polymer = POLYMERS_LIST[Math.floor(Math.random() * POLYMERS_LIST.length)];
      const isNano = Math.random() > 0.45;
      const sizeNm = isNano
        ? 40 + Math.random() * 260 // 40 - 300 nm nanoplastic
        : 800 + Math.random() * 4500; // 0.8 - 5.3 um microplastic
      const radius = isNano ? 3 : 5 + Math.random() * 4;

      list.push({
        id: nextIdRef.current++,
        x: Math.random() * width,
        y: 35 + Math.random() * (height - 70),
        vx: 1.3 + Math.random() * 0.7,
        vy: (Math.random() - 0.5) * 0.3,
        radius,
        type: 'Plastic',
        polymer,
        shape: polymer === 'Nylon' ? 'fiber' : polymer === 'PS' ? 'sphere' : 'shard',
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.1,
        aspectRatio: polymer === 'Nylon' ? 0.2 : 0.6 + Math.random() * 0.4,
        boundToSpion: false,
        cleared: false,
        sizeNm: Math.round(sizeNm),
        surfaceChargeMv: -22 - Math.random() * 15,
        opacity: 1,
      });
    }

    particlesRef.current = list;
  }, [currentUgMl, baselineUgMl]);

  // Handle canvas resize and initial population
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = Math.max(340, rect.height) * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${Math.max(340, rect.height)}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);

      if (particlesRef.current.length === 0) {
        initParticles(rect.width, Math.max(340, rect.height));
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [initParticles]);

  // Main render and physics loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.width / dpr;
        const height = canvas.height / dpr;

        if (ctx) {
          // 1. Clear background
          ctx.fillStyle = '#060B15';
          ctx.fillRect(0, 0, width, height);

          // 2. Channel Boundaries & Wall Visuals (Laminar microfluidic biocompatible lumen)
          renderChannelBackground(ctx, width, height, stage, showFieldOverlays, acousticPowerW, magneticFieldTesla);

          // 3. Update physics if running
          if (isRunning) {
            updatePhysics(
              particlesRef.current,
              width,
              height,
              dt * speedMultiplier,
              flowRateMlMin,
              stage,
              magneticFieldTesla,
              acousticPowerW,
              onParticleCleared
            );
          }

          // 4. Render all particles
          renderParticles(ctx, particlesRef.current, selectedParticle, hoveredParticle, stage);

          // 5. Render active instrumentation overlays
          renderStageOverlays(ctx, width, height, stage, isRunning, acousticPowerW, magneticFieldTesla);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    isRunning,
    speedMultiplier,
    flowRateMlMin,
    stage,
    magneticFieldTesla,
    acousticPowerW,
    showFieldOverlays,
    selectedParticle,
    hoveredParticle,
    onParticleCleared,
  ]);

  // Physics engine for blood stream & multi-stage clearance
  const updatePhysics = (
    particles: BloodParticle[],
    width: number,
    height: number,
    dt: number,
    flowRate: number,
    currentStage: ApheresisStage,
    bTesla: number,
    pAcoustic: number,
    clearedCallback: (polymer: PolymerType, sizeNm: number) => void
  ) => {
    const flowScale = (flowRate / 180) * 80; // pixels per second
    const channelTop = 32;
    const channelBottom = height - 32;
    const centerY = height / 2;

    // Stage regions along X axis (when in 'all' stage)
    const stage1X = width * 0.28; // Acoustic separation zone
    const stage2X = width * 0.58; // Magnetic SPION zone
    const stage3X = width * 0.85; // MIP Hemoperfusion column

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Parabolic laminar flow velocity profile: faster at center, slower at walls
      const distFromCenter = Math.abs(p.y - centerY) / (centerY - channelTop);
      const laminarFactor = Math.max(0.25, 1.0 - distFromCenter * distFromCenter * 0.65);
      const currentVx = (p.vx * flowScale * laminarFactor + 20) * dt;

      p.x += currentVx;
      p.y += p.vy * 40 * dt;
      p.rotation += p.vRot * (currentVx * 0.1);

      // Boundary bouncing
      if (p.y - p.radius < channelTop) {
        p.y = channelTop + p.radius;
        p.vy = Math.abs(p.vy);
      } else if (p.y + p.radius > channelBottom) {
        p.y = channelBottom - p.radius;
        p.vy = -Math.abs(p.vy);
      }

      // STAGE-SPECIFIC CLEARANCE MECHANICS:
      if (p.type === 'Plastic' && !p.cleared) {
        // --- STAGE 1: Acoustophoresis (Ultrasonic standing wave separation) ---
        const inAcousticZone = currentStage === 'acoustic' || (currentStage === 'all' && p.x > width * 0.15 && p.x < stage1X);
        if (inAcousticZone && pAcoustic > 0) {
          const polymerData = p.polymer ? POLYMER_REGISTRY[p.polymer] : null;
          const phi = polymerData ? polymerData.acousticContrastFactor : 0.15;
          // Acoustic radiation force F_rad ~ phi * d^3 * P^2
          const acousticForce = phi * (p.sizeNm > 1000 ? 2.5 : 0.8) * (pAcoustic / 10);

          if (phi > 0.2) {
            // Moves towards lateral collector side channels (upward or downward)
            p.vy += (p.y < centerY ? -1 : 1) * acousticForce * 1.5 * dt;
          } else if (phi < 0) {
            // Negative acoustic contrast (e.g. PE or PP) migrates toward pressure anti-nodes
            p.vy += (p.y < centerY ? 1 : -1) * Math.abs(phi) * 2.0 * dt;
          }

          // If pushed into upper collector trap
          if (p.y < channelTop + 14 || p.y > channelBottom - 14) {
            if (p.sizeNm > 1200 && Math.random() < 0.25) {
              p.cleared = true;
              p.clearanceStage = 1;
              clearedCallback(p.polymer || 'PET', p.sizeNm);
            }
          }
        }

        // --- STAGE 2: Biofunctionalized Magnetic SPION Capture ---
        const inMagneticZone = currentStage === 'magnetic' || (currentStage === 'all' && p.x >= stage1X && p.x < stage2X);
        if (inMagneticZone && bTesla > 0.2) {
          // Binding probability
          if (!p.boundToSpion) {
            p.boundToSpion = true; // Hydrophobic corona binding
          }

          // Magnetic force directed toward upper Halbach permanent magnet array:
          // F_mag = (V * delta_chi / mu_0) * (B * grad B)
          const magneticForce = bTesla * 38;
          p.vy -= magneticForce * dt; // Pushed upward toward magnetic trap

          // Extracted into upper HGMS trap
          if (p.y < channelTop + 12) {
            p.cleared = true;
            p.clearanceStage = 2;
            clearedCallback(p.polymer || 'PS', p.sizeNm);
          }
        }

        // --- STAGE 3: Molecularly Imprinted Polymer (MIP) Hemoperfusion ---
        const inMIPZone = currentStage === 'hemoperfusion' || (currentStage === 'all' && p.x >= stage2X && p.x < stage3X);
        if (inMIPZone) {
          // High affinity for submicron nanoplastics (< 800 nm)
          if (p.sizeNm < 800) {
            // Captured inside polymer cavity
            p.vx *= 0.6;
            p.opacity = Math.max(0.1, p.opacity - 2.5 * dt);
            if (p.opacity <= 0.2) {
              p.cleared = true;
              p.clearanceStage = 3;
              clearedCallback(p.polymer || 'PET', p.sizeNm);
            }
          }
        }
      }

      // RBC & Platelet preservation (ensure biological cells are gently focused to central streamline)
      if (p.type === 'RBC' || p.type === 'Platelet') {
        const inAcousticZone = currentStage === 'acoustic' || (currentStage === 'all' && p.x > width * 0.15 && p.x < stage1X);
        if (inAcousticZone && pAcoustic > 0) {
          // RBCs have positive acoustic contrast (phi ~ 0.25) and migrate to pressure node at center
          const targetY = centerY;
          const diff = targetY - p.y;
          p.vy += diff * 0.4 * (pAcoustic / 10) * dt;
        }
      }

      // Wrap around or respawn particles exiting the channel right side
      if (p.x > width + 25 || p.cleared) {
        p.x = -20 - Math.random() * 40;
        p.y = channelTop + 10 + Math.random() * (channelBottom - channelTop - 20);
        p.vy = (Math.random() - 0.5) * 0.3;
        p.boundToSpion = false;
        p.opacity = 1;
        p.cleared = false;

        // Plastic particle respawn rate calibrated to current residual burden
        if (p.type === 'Plastic') {
          const respawnChance = Math.min(1.0, currentUgMl / Math.max(0.5, baselineUgMl));
          if (Math.random() > respawnChance) {
            // Turn temporarily into an inert RBC to reflect cleared state
            p.type = 'RBC';
            p.radius = 11;
            p.sizeNm = 7500;
          }
        }
      }
    }
  };

  // Rendering Channel Walls, Fluid, and Field Backgrounds
  const renderChannelBackground = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    curStage: ApheresisStage,
    showOverlays: boolean,
    pAcoustic: number,
    bTesla: number
  ) => {
    const channelTop = 32;
    const channelBottom = height - 32;

    // Blood plasma fluid gradient
    const plasmaGrad = ctx.createLinearGradient(0, channelTop, 0, channelBottom);
    plasmaGrad.addColorStop(0, '#2b090e'); // Deep blood ruby-red
    plasmaGrad.addColorStop(0.5, '#450a12');
    plasmaGrad.addColorStop(1, '#2b090e');
    ctx.fillStyle = plasmaGrad;
    ctx.fillRect(0, channelTop, width, channelBottom - channelTop);

    // Subtle fluid streamline grid
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.lineWidth = 1;
    for (let y = channelTop + 20; y < channelBottom; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Upper and Lower Biocompatible Extracorporeal Microchannel Walls
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, channelTop);
    ctx.fillRect(0, channelBottom, width, height - channelBottom);

    // Hairline wall boundary with tick calibrations
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, channelTop);
    ctx.lineTo(width, channelTop);
    ctx.moveTo(0, channelBottom);
    ctx.lineTo(width, channelBottom);
    ctx.stroke();

    // Measurement ticks along upper wall
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, channelTop - 6);
      ctx.lineTo(x, channelTop);
      ctx.moveTo(x, channelBottom);
      ctx.lineTo(x, channelBottom + 6);
      ctx.stroke();
    }

    if (!showOverlays) return;

    // STAGE ZONES & PHYSICAL FIELDS VISUALIZATION
    const stage1X = width * 0.28;
    const stage2X = width * 0.58;
    const stage3X = width * 0.85;

    // 1. Acoustic Standing Wave Zone (left section)
    if (curStage === 'all' || curStage === 'acoustic') {
      const startX = curStage === 'acoustic' ? 20 : width * 0.12;
      const endX = curStage === 'acoustic' ? width - 20 : stage1X;

      // Standing wave sinusoidal pressure profile
      ctx.save();
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)'; // Cyan
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      // Nodal center line
      const centerY = height / 2;
      ctx.beginPath();
      ctx.moveTo(startX, centerY);
      ctx.lineTo(endX, centerY);
      ctx.stroke();

      // Ultrasound wave fronts
      const waveFreq = 28;
      for (let x = startX; x < endX; x += waveFreq) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 + (pAcoustic / 40)})`;
        ctx.beginPath();
        ctx.moveTo(x, channelTop);
        ctx.lineTo(x, channelBottom);
        ctx.stroke();
      }
      ctx.restore();

      // Lateral Acoustic Traps (Upper / Lower waste splitters)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.15)';
      ctx.fillRect(endX - 25, 0, 25, channelTop);
      ctx.fillRect(endX - 25, channelBottom, 25, height - channelBottom);
    }

    // 2. High-Gradient Magnetic Field Zone (middle section)
    if (curStage === 'all' || curStage === 'magnetic') {
      const startX = curStage === 'magnetic' ? 20 : stage1X;
      const endX = curStage === 'magnetic' ? width - 20 : stage2X;

      // Permanent Neodymium Halbach array on top
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.fillRect(startX, 0, endX - startX, channelTop);

      // Curved Magnetic Flux Lines (pulling upwards)
      ctx.save();
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.15 + (bTesla / 8)})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);

      for (let x = startX + 20; x < endX; x += 35) {
        ctx.beginPath();
        ctx.moveTo(x, channelBottom);
        ctx.bezierCurveTo(x - 10, height * 0.6, x + 15, height * 0.3, x + 5, channelTop);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. MIP Nanoporous Cartridge Zone (right section)
    if (curStage === 'all' || curStage === 'hemoperfusion') {
      const startX = curStage === 'hemoperfusion' ? 20 : stage2X;
      const endX = curStage === 'hemoperfusion' ? width - 20 : stage3X;

      // Hydrogel beads lattice
      ctx.save();
      ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
      for (let x = startX + 15; x < endX; x += 22) {
        for (let y = channelTop + 15; y < channelBottom; y += 22) {
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // 4. Optical Micro-Raman Laser Stage (Effluent verification)
    if (curStage === 'all' || curStage === 'spectroscopy') {
      const laserX = curStage === 'spectroscopy' ? width * 0.5 : width * 0.92;
      ctx.save();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(laserX, 0);
      ctx.lineTo(laserX, height);
      ctx.stroke();

      // Laser focal waist
      const centerY = height / 2;
      ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
      ctx.beginPath();
      ctx.arc(laserX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  // Rendering Individual Blood Cells and Plastic Particles
  const renderParticles = (
    ctx: CanvasRenderingContext2D,
    particles: BloodParticle[],
    selected: BloodParticle | null,
    hovered: BloodParticle | null,
    _curStage: ApheresisStage
  ) => {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.cleared) continue;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      const isTarget = (selected && selected.id === p.id) || (hovered && hovered.id === p.id);

      // Red Blood Cell (Erythrocyte) - Biconcave Disc
      if (p.type === 'RBC') {
        ctx.scale(1, p.aspectRatio);

        // Outer red membrane
        const grad = ctx.createRadialGradient(0, 0, p.radius * 0.2, 0, 0, p.radius);
        grad.addColorStop(0, '#7f1d1d'); // Dark dimple center of biconcave disc
        grad.addColorStop(0.65, '#dc2626'); // Rich oxygenated hemoglobin rim
        grad.addColorStop(1, '#991b1b');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle specular highlight on rim
        ctx.strokeStyle = 'rgba(254, 202, 202, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius * 0.85, 0.2, Math.PI * 0.9);
        ctx.stroke();
      }

      // Platelet - small discoid thrombocyte
      else if (p.type === 'Platelet') {
        ctx.scale(1, p.aspectRatio);
        ctx.fillStyle = '#FDE047'; // Golden amber
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // White Blood Cell (Leukocyte) - spherical granular cell
      else if (p.type === 'WBC') {
        const wbcGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, p.radius);
        wbcGrad.addColorStop(0, '#c084fc');
        wbcGrad.addColorStop(1, '#6b21a8');
        ctx.fillStyle = wbcGrad;
        ctx.beginPath();
        ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Nuclear lobes inside
        ctx.fillStyle = '#3b0764';
        ctx.beginPath();
        ctx.arc(-3, -2, p.radius * 0.35, 0, Math.PI * 2);
        ctx.arc(3, 2, p.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Microplastics and Nanoplastics (MNPs)
      else if (p.type === 'Plastic') {
        const polyData = p.polymer ? POLYMER_REGISTRY[p.polymer] : null;
        const color = polyData ? polyData.colorHex : '#38BDF8';

        // High-contrast stroke for microscopic visibility
        ctx.fillStyle = color;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.2;

        if (p.shape === 'sphere') {
          // Polystyrene microsphere
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (p.shape === 'fiber') {
          // Synthetic nylon/polyester textile microfiber
          ctx.beginPath();
          ctx.roundRect(-p.radius * 2.8, -1.8, p.radius * 5.6, 3.6, 1.5);
          ctx.fill();
          ctx.stroke();
        } else {
          // Irregular crystalline microplastic fragment / shard
          ctx.beginPath();
          ctx.moveTo(-p.radius, -p.radius * 0.6);
          ctx.lineTo(p.radius * 0.8, -p.radius * 1.1);
          ctx.lineTo(p.radius * 1.2, p.radius * 0.3);
          ctx.lineTo(p.radius * 0.2, p.radius * 1.2);
          ctx.lineTo(-p.radius * 1.1, p.radius * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // SPION nanoparticle cluster bound to plastic surface (Stage 2)
        if (p.boundToSpion) {
          ctx.fillStyle = '#1e293b'; // Superparamagnetic iron oxide core
          ctx.strokeStyle = '#ef4444'; // Magnetic polarity ring
          ctx.lineWidth = 1;
          for (let b = 0; b < 3; b++) {
            const bx = Math.cos(b * 2) * (p.radius + 3);
            const by = Math.sin(b * 2) * (p.radius + 3);
            ctx.beginPath();
            ctx.arc(bx, by, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }
      }

      // Selection or Hover Reticle
      if (isTarget) {
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(0, 0, p.radius + 7, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  };

  // Rendering Labels, Crosshairs and Sensor HUD
  const renderStageOverlays = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    curStage: ApheresisStage,
    running: boolean,
    _pAcoustic: number,
    _bTesla: number
  ) => {
    ctx.save();
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';

    if (curStage === 'all') {
      // Zone 1 label
      ctx.fillText('01. ACOUSTOPHOREIS (1.8-3.2 MHz)', width * 0.12, 22);
      // Zone 2 label
      ctx.fillText('02. SPION MAGNETIC HGMS (1.8 T)', width * 0.34, 22);
      // Zone 3 label
      ctx.fillText('03. MIP HEMOPERFUSION', width * 0.62, 22);
      // Zone 4 label
      ctx.fillText('04. RAMAN 785nm', width * 0.86, 22);
    } else {
      ctx.fillStyle = '#38BDF8';
      ctx.fillText(`FOCUSED STAGE INSPECTION: ${curStage.toUpperCase()}`, 24, 22);
    }

    // Live Flow Direction Indicators
    ctx.fillStyle = running ? '#34D399' : '#94A3B8';
    ctx.fillText('LAMINAR BLOOD INFLOW →', 16, height - 12);
    ctx.fillText('CLEAN EFFLUENT TO VENOUS RETURN →', width - 240, height - 12);

    ctx.restore();
  };

  // Mouse interaction: Inspect particle on click or hover
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    let closest: BloodParticle | null = null;
    let minDist = 25; // Click radius threshold

    for (const p of particlesRef.current) {
      if (p.cleared) continue;
      const d = Math.hypot(p.x - clickX, p.y - clickY);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    }

    onSelectParticle(closest);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let closest: BloodParticle | null = null;
    let minDist = 20;

    for (const p of particlesRef.current) {
      if (p.cleared) continue;
      const d = Math.hypot(p.x - mouseX, p.y - mouseY);
      if (d < minDist) {
        minDist = d;
        closest = p;
      }
    }

    setHoveredParticle(closest);
  };

  return (
    <div className="flex flex-col bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-mono font-medium text-slate-300">
              {isRunning ? 'CIRCUIT ACTIVE' : 'SYSTEM PAUSED'}
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Stage selector buttons */}
          <div className="flex items-center bg-slate-900 rounded p-0.5 border border-slate-800">
            <button
              onClick={() => onSelectStage('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                stage === 'all' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Circuit
            </button>
            <button
              onClick={() => onSelectStage('acoustic')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                stage === 'acoustic' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3 h-3" />
              1. Acoustic
            </button>
            <button
              onClick={() => onSelectStage('magnetic')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                stage === 'magnetic' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Magnet className="w-3 h-3" />
              2. SPION Magnetic
            </button>
            <button
              onClick={() => onSelectStage('hemoperfusion')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                stage === 'hemoperfusion' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Filter className="w-3 h-3" />
              3. MIP Cartridge
            </button>
            <button
              onClick={() => onSelectStage('spectroscopy')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                stage === 'spectroscopy' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              4. Raman Sensor
            </button>
          </div>
        </div>

        {/* Playback & Overlay Controls */}
        <div className="flex items-center gap-2">
          {/* Speed selector */}
          <div className="flex items-center bg-slate-900 rounded border border-slate-800 p-0.5 text-xs font-mono">
            {[1, 2, 4].map((mult) => (
              <button
                key={mult}
                onClick={() => setSpeedMultiplier(mult)}
                className={`px-2 py-0.5 rounded ${
                  speedMultiplier === mult ? 'bg-slate-800 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mult}x
              </button>
            ))}
          </div>

          {/* Toggle overlays */}
          <button
            onClick={() => setShowFieldOverlays(!showFieldOverlays)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1.5 ${
              showFieldOverlays
                ? 'bg-slate-800 text-cyan-300 border-cyan-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Acoustic & Magnetic Field Lines"
          >
            <Eye className="w-3 h-3" />
            Field Lines
          </button>

          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1 text-xs font-semibold rounded flex items-center gap-1.5 transition-colors ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Stream
              </>
            )}
          </button>

          {/* Reset */}
          <button
            onClick={() => {
              if (canvasRef.current) {
                initParticles(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            title="Reset Particle Distribution"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative w-full h-[380px] bg-slate-950 overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredParticle(null)}
          className="w-full h-full block"
        />

        {/* Hover quick-tooltip */}
        {hoveredParticle && !selectedParticle && (
          <div
            className="absolute pointer-events-none z-10 px-2.5 py-1.5 bg-slate-900/95 border border-slate-700 rounded shadow-lg text-xs font-mono backdrop-blur-sm"
            style={{
              left: Math.min(hoveredParticle.x + 12, (canvasRef.current?.clientWidth || 600) - 160),
              top: Math.max(hoveredParticle.y - 35, 10),
            }}
          >
            {hoveredParticle.type === 'Plastic' ? (
              <div>
                <span className="font-semibold text-cyan-300">
                  {hoveredParticle.polymer} {hoveredParticle.sizeNm < 1000 ? 'Nanoplastic' : 'Microplastic'}
                </span>
                <div className="text-[11px] text-slate-400">
                  Size: {hoveredParticle.sizeNm} nm · {hoveredParticle.shape}
                </div>
              </div>
            ) : (
              <div>
                <span className="font-semibold text-rose-300">{hoveredParticle.type}</span>
                <div className="text-[11px] text-slate-400">Size: ~{(hoveredParticle.sizeNm / 1000).toFixed(1)} µm</div>
              </div>
            )}
            <div className="text-[10px] text-slate-500 mt-0.5">Click to inspect spectroscopy</div>
          </div>
        )}

        {/* Legend Overlay at bottom right */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-slate-950/85 border border-slate-800/80 rounded backdrop-blur-md flex items-center gap-4 text-xs font-mono pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-red-400" />
            <span className="text-slate-400">RBC (7.5 µm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-slate-400">Platelet (2.5 µm)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-cyan-400 border border-white" />
            <span className="text-cyan-300 font-semibold">Plastic (PET/PS/PE/PVC)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-800 border border-red-500" />
            <span className="text-rose-400">SPION Nanobead</span>
          </div>
        </div>

        {/* Click-to-inspect instruction prompt */}
        {!selectedParticle && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-slate-950/70 border border-slate-800 rounded text-[11px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span>Interactive: Click any cell or plastic shard to open Spectrographic HUD</span>
          </div>
        )}
      </div>
    </div>
  );
};
