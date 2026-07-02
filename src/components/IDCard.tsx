/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Printer, Eye, Shield, Cpu, Sparkles, Terminal, Layers, Wifi, User, CheckCircle, ArrowRight } from 'lucide-react';
import { Agent, SCIFI_AVATARS } from '../types';
import GuildIcon from './GuildIcon';

interface IDCardProps {
  agent: Agent;
}

export default function IDCard({ agent }: IDCardProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // sound helper
  const playBeep = (freq = 800, duration = 0.1) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const playGlitchSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playClickAtTime = (freq: number, startTime: number, vol: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(vol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.04);
      };
      playClickAtTime(1200, ctx.currentTime, 0.02);
      playClickAtTime(600, ctx.currentTime + 0.02, 0.015);
      playClickAtTime(1600, ctx.currentTime + 0.04, 0.01);
    } catch (e) {}
  };

  // Generate and download ID Card as PNG using canvas
  const handleDownload = async () => {
    setDownloading(true);
    playBeep(900, 0.15);

    try {
      // Create a canvas with high-resolution proportions (800x500)
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background
      ctx.fillStyle = '#0d0d10';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sci-fi Tech grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 25;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Draw Borders and tech corner brackets
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2;
      ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

      ctx.strokeStyle = '#deed00';
      ctx.lineWidth = 4;
      // Top-Left bracket
      ctx.beginPath();
      ctx.moveTo(10, 40);
      ctx.lineTo(10, 10);
      ctx.lineTo(40, 10);
      ctx.stroke();

      // Bottom-Right bracket
      ctx.beginPath();
      ctx.moveTo(canvas.width - 10, canvas.height - 40);
      ctx.lineTo(canvas.width - 10, canvas.height - 10);
      ctx.lineTo(canvas.width - 40, canvas.height - 10);
      ctx.stroke();

      // 3. Cyber decorations
      ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
      ctx.fillRect(15, 15, canvas.width - 30, 40); // Top bar

      // Header text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "JetBrains Mono", Courier, monospace';
      ctx.fillText('MPLS CYBER ACADEMY // NEURAL IDENTITY', 35, 41);

      ctx.fillStyle = '#deed00';
      ctx.font = 'bold 11px "JetBrains Mono", Courier, monospace';
      ctx.fillText('SECURE ACCESS CARD', canvas.width - 180, 40);

      // 4. Draw Avatar Profile Photo
      // We will draw placeholder or try to load agent avatar image
      const avatarX = 50;
      const avatarY = 90;
      const avatarW = 180;
      const avatarH = 180;

      // Draw Avatar Box
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.strokeRect(avatarX, avatarY, avatarW, avatarH);

      // Loading user image onto canvas
      const drawInfoAndSave = () => {
        // Draw avatar scan lines
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        ctx.lineWidth = 1;
        for (let y = avatarY + 10; y < avatarY + avatarH; y += 15) {
          ctx.beginPath();
          ctx.moveTo(avatarX, y);
          ctx.lineTo(avatarX + avatarW, y);
          ctx.stroke();
        }

        // 5. Draw Biodata Information
        const infoX = 260;
        let currentY = 110;

        // Label style helper
        const drawLabelValue = (label: string, value: string, highlightColor = '#ffffff') => {
          ctx.fillStyle = '#666666';
          ctx.font = '9px "JetBrains Mono", Courier, monospace';
          ctx.fillText(label.toUpperCase(), infoX, currentY);
          currentY += 18;

          ctx.fillStyle = highlightColor;
          ctx.font = 'bold 16px "Inter", sans-serif';
          ctx.fillText(value, infoX, currentY);
          currentY += 28;
        };

        drawLabelValue('NAMA LENGKAP / FULL NAME', agent.fullName || agent.name, '#ffffff');
        drawLabelValue('ALIAS CODE NAME', agent.name, '#00f0ff');
        drawLabelValue('NOMOR INDUK SISWA (NIS)', agent.nis || 'PANITIA-9922', '#deed00');
        drawLabelValue('JURUSAN / MAJOR DEPARTMENT', agent.jurusan || 'SYS AUTHORITY', '#ffffff');

        // Draw Right Sidebar (Guild, Level, Status)
        const rightX = 540;
        let rightY = 110;

        const drawRightBlock = (label: string, value: string, color: string) => {
          ctx.fillStyle = '#555555';
          ctx.font = '9px "JetBrains Mono", Courier, monospace';
          ctx.fillText(label.toUpperCase(), rightX, rightY);
          rightY += 16;

          ctx.fillStyle = color;
          ctx.font = 'bold 15px "JetBrains Mono", sans-serif';
          ctx.fillText(value, rightX, rightY);
          rightY += 32;
        };

        drawRightBlock('FAKSI / GUILD DIVISION', agent.guild, '#00f0ff');
        drawRightBlock('LEVEL OF SYNC', `LEVEL ${agent.level} (${agent.exp % 100}/100 XP)`, '#deed00');
        drawRightBlock('SECURITY STATUS', agent.status, agent.status === 'SYSTEM OVERLORD' ? '#ff3b30' : '#2ae500');

        // Draw Barcode on the bottom
        ctx.fillStyle = '#ffffff';
        const barcodeX = 50;
        const barcodeY = 320;
        const barcodeW = 700;
        const barcodeH = 40;

        // Draw fake sci-fi bar code stripes
        ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
        let xPos = barcodeX;
        while (xPos < barcodeX + barcodeW) {
          const stripeW = Math.floor(Math.random() * 8) + 2;
          const spaceW = Math.floor(Math.random() * 8) + 2;
          ctx.fillRect(xPos, barcodeY, stripeW, barcodeH);
          xPos += stripeW + spaceW;
        }

        // Print card footer meta
        ctx.fillStyle = '#555555';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(`DEVICE_UID: ${Math.random().toString(16).substr(2, 8).toUpperCase()} // NEURAL_SEC_KEY: ${btoa(agent.name).substr(0, 16).toUpperCase()}`, 50, 395);
        ctx.fillText('WARNING: THIS DIGITAL ASSET IS PROPERTY OF MPLS CYBER COMMAND PLATFORM 2026. UNAUTHORIZED REPLICATION IS HIGHLY SANCTIONED.', 50, 410);

        // Tech visual crosshair dots
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(35, 75, 4, 4);
        ctx.fillRect(canvas.width - 39, 75, 4, 4);
        ctx.fillRect(35, canvas.height - 110, 4, 4);
        ctx.fillRect(canvas.width - 39, canvas.height - 110, 4, 4);

        // 6. Trigger actual image download
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `mpls_idcard_${agent.name.toLowerCase().replace(/\s+/g, '_')}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloading(false);
      };

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Draw standard user image clipped/fitted
        ctx.drawImage(img, avatarX, avatarY, avatarW, avatarH);
        drawInfoAndSave();
      };
      img.onerror = () => {
        // Draw solid tech block if image fails or is data URI with CORS issue
        ctx.fillStyle = '#1c1c24';
        ctx.fillRect(avatarX, avatarY, avatarW, avatarH);
        ctx.strokeStyle = '#00f0ff';
        ctx.beginPath();
        ctx.moveTo(avatarX, avatarY);
        ctx.lineTo(avatarX + avatarW, avatarY + avatarH);
        ctx.moveTo(avatarX + avatarW, avatarY);
        ctx.lineTo(avatarX, avatarY + avatarH);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('SECURE FACEPRINT', avatarX + avatarW / 2, avatarY + avatarH / 2 - 5);
        ctx.fillText('ENCRYPTED LOCK', avatarX + avatarW / 2, avatarY + avatarH / 2 + 10);
        ctx.textAlign = 'left';

        drawInfoAndSave();
      };

      // Set image source (handling base64 or external url)
      img.src = agent.avatar || SCIFI_AVATARS[0];

    } catch (err) {
      console.error(err);
      setDownloading(false);
    }
  };

  // Perform full print request using standard media style print
  const handlePrint = () => {
    playBeep(700, 0.1);
    window.print();
  };

  return (
    <div id="id-card-menu-root" className="space-y-6">
      {/* Menu Header Description */}
      <div className="flex justify-between items-center bg-[#131315]/70 border border-gray-800 p-5 rounded-2xl">
        <div>
          <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-widest font-black block">SYSTEM PROTOCOL // ENGAGE ID-CARD</span>
          <h2 className="font-sans text-xl font-extrabold text-white uppercase mt-0.5">Tactical Identity Matrix</h2>
          <p className="font-mono text-[11px] text-gray-500 mt-1">Generated tactical registration card for offline physical checkpoints.</p>
        </div>

        <div className="flex gap-2">
          {/* View Full Card */}
          <button
            onClick={() => { playBeep(1000, 0.08); setIsFullscreen(true); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded border border-gray-800 transition-all"
            title="Inspect ID Card details up close"
          >
            <Eye className="w-3.5 h-3.5 text-[#deed00]" />
            <span className="hidden sm:inline">View Large</span>
          </button>

          {/* Download PNG */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#00f0ff] text-black hover:bg-[#00f0ff]/90 font-mono text-[10px] uppercase font-extrabold tracking-wider rounded transition-all disabled:opacity-50"
            title="Download ID Card as high-res PNG image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Compiling...' : 'Download'}</span>
          </button>

          {/* Print Card */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#deed00] text-black hover:bg-[#deed00]/90 font-mono text-[10px] uppercase font-extrabold tracking-wider rounded transition-all"
            title="Print ID Card directly from system"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Actual ID Card Layout Display */}
      <div className="flex justify-center py-6">
        <div
          ref={cardRef}
          id="id-card-printable"
          onMouseEnter={playGlitchSound}
          className="print-card-wrapper id-card-hover group w-full max-w-[540px] aspect-[1.6/1] bg-gradient-to-br from-[#0c0c0e] via-[#121216] to-[#070709] border-2 border-[#00f0ff]/60 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative overflow-hidden flex flex-col justify-between cursor-pointer"
        >
          {/* Cybernetic Glitch Overlays */}
          <div className="glitch-overlay glitch-overlay-1 pointer-events-none" />
          <div className="glitch-overlay glitch-overlay-2 pointer-events-none" />

          {/* Futuristic grid/dot matrix details */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-50" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/60 pointer-events-none" />

          {/* Glowing scanline sweep animation */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/30 shadow-[0_0_10px_#00f0ff] animate-scan-sweep pointer-events-none" />

          {/* Corner Decals */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#deed00]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#deed00]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#deed00]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#deed00]" />

          {/* Header row */}
          <div className="flex justify-between items-center border-b border-[#00f0ff]/30 pb-2.5 z-10">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#deed00] animate-pulse" />
              <div>
                <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-wider block leading-none">MPLS CYBER ACADEMY 2026</span>
                <span className="glitch-text font-sans text-[11px] font-black text-white tracking-widest uppercase block mt-0.5">NEURAL ACCESS CARD</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-[7px] text-gray-500 uppercase block leading-none">SECURITY LEVEL</span>
              <span className="glitch-text font-mono text-[10px] text-[#deed00] font-black uppercase tracking-wider">
                {agent.role === 'admin' ? 'SYSTEM_OVERLORD' : 'STUDENT_CLASS_A'}
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="grid grid-cols-12 gap-4 items-center my-3 z-10">
            {/* Left Col: Avatar Photo */}
            <div className="col-span-4 flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#00f0ff]/40 bg-black/50 p-0.5 shadow-[0_0_15px_rgba(0,240,255,0.1)] group">
                {/* Tech HUD overlay on photo */}
                <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none group-hover:bg-transparent transition-all" />
                <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#00f0ff]" />
                <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#00f0ff]" />
                <img
                  className="glitch-avatar w-full h-full object-cover rounded grayscale hover:grayscale-0 transition-all duration-300"
                  src={agent.avatar || SCIFI_AVATARS[0]}
                  alt="Agent Facetag"
                />
              </div>
              <span className="font-mono text-[7px] text-gray-500 tracking-wider uppercase mt-1">FACIAL SCAN MATCHED</span>
            </div>

            {/* Middle Col: Biodata list */}
            <div className="col-span-8 space-y-2">
              {/* Name Block */}
              <div>
                <span className="font-mono text-[7px] text-gray-500 uppercase block leading-none">Nama Lengkap // Full Name</span>
                <span className="glitch-text font-sans text-sm font-black text-white tracking-wide uppercase block">
                  {agent.fullName || agent.name}
                </span>
              </div>

              {/* Alias / NIS row */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-mono text-[7px] text-gray-500 uppercase block leading-none">Code Name Alias</span>
                  <span className="font-mono text-[10px] text-[#00f0ff] font-bold uppercase">{agent.name}</span>
                </div>
                <div>
                  <span className="font-mono text-[7px] text-gray-500 uppercase block leading-none">NIS ID</span>
                  <span className="font-mono text-[10px] text-[#deed00] font-bold">{agent.nis || 'PANITIA-9922'}</span>
                </div>
              </div>

              {/* Jurusan and Guild division */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-mono text-[7px] text-gray-500 uppercase block leading-none">Major Department</span>
                  <span className="font-mono text-[10px] text-white font-semibold uppercase">{agent.jurusan || 'SYS ADMIN'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[7px] text-gray-500 uppercase block leading-none">Guild Faksi</span>
                  <span className="font-mono text-[10px] text-[#00f0ff] font-bold uppercase flex items-center gap-1">
                    <GuildIcon guildName={agent.guild} className="w-3 h-3 flex-shrink-0" />
                    {agent.guild}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Barcode / Card Details Row */}
          <div className="flex justify-between items-end border-t border-gray-800/80 pt-2 z-10">
            {/* Holographic Chip graphic */}
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-sm border border-black/40 relative overflow-hidden flex flex-col justify-between p-0.5">
                <div className="w-full h-[1px] bg-black/40" />
                <div className="w-full h-[1px] bg-black/40" />
                <div className="w-full h-[1px] bg-black/40" />
              </div>
              <span className="font-mono text-[6px] text-gray-500">BIOMETRIC SYNC // ENABLED</span>
            </div>

            {/* Level badge */}
            <div className="flex gap-2 items-center">
              <div className="text-right">
                <span className="font-mono text-[6px] text-gray-500 uppercase block leading-none">Neural Rank</span>
                <span className="font-mono text-[10px] text-white font-bold block leading-none">LVL {agent.level}</span>
              </div>
              <div className="w-5 h-5 rounded bg-[#deed00] text-black font-mono text-[9px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(222,237,0,0.3)]">
                {agent.level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk Scanner Lines CSS */}
      <style>{`
        @keyframes scan-sweep {
          0% { top: 0%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-sweep {
          animation: scan-sweep 6s linear infinite;
        }

        /* Glitch Hover Effect and keyframes */
        .id-card-hover {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .id-card-hover:hover {
          transform: translateY(-2px) scale(1.015);
          border-color: #deed00 !important;
          box-shadow: 0 0 50px rgba(0, 240, 255, 0.35), 
                      inset 0 0 20px rgba(222, 237, 0, 0.2);
        }

        /* Trigger glitch keyframes on card hover */
        .id-card-hover:hover .glitch-avatar {
          animation: glitch-avatar-anim 0.25s steps(2) infinite;
        }

        .id-card-hover:hover .glitch-text {
          animation: glitch-text-anim 0.35s steps(2) infinite;
          color: #00f0ff;
        }

        @keyframes glitch-avatar-anim {
          0% { filter: hue-rotate(0deg) saturate(1.5) contrast(1.2); transform: translate(1px, -1px); }
          50% { filter: hue-rotate(80deg) saturate(2) contrast(1.4); transform: translate(-1px, 1px) skewX(2deg); }
          100% { filter: hue-rotate(160deg) saturate(1.2) contrast(1); transform: translate(0px, 0px); }
        }

        @keyframes glitch-text-anim {
          0% { text-shadow: 1.5px -1px 0 #ff0055, -1.5px 1px 0 #00f0ff; transform: translate(-0.5px, 0.5px); }
          25% { text-shadow: -1px 1.5px 0 #ff0055, 1.5px -1px 0 #deed00; transform: translate(0.5px, -0.5px); }
          50% { text-shadow: 1.5px 1px 0 #deed00, -1.5px -1px 0 #ff0055; transform: translate(-1px, -0.5px); }
          75% { text-shadow: -1.5px -1px 0 #00f0ff, 1px 1.5px 0 #deed00; transform: translate(0.5px, 1px); }
          100% { text-shadow: 1px -1.5px 0 #ff0055, -1px 1px 0 #00f0ff; transform: translate(0px, 0px); }
        }

        /* Full card layout glitch overlays */
        .glitch-overlay {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          pointer-events: none;
        }

        .id-card-hover:hover .glitch-overlay {
          display: block;
          opacity: 0.15;
          z-index: 30;
        }

        .id-card-hover:hover .glitch-overlay-1 {
          animation: glitch-overlay-anim-1 0.5s linear infinite;
          clip-path: inset(15% 0 65% 0);
          background-color: rgba(0, 240, 255, 0.15);
          transform: translateX(-4px);
        }

        .id-card-hover:hover .glitch-overlay-2 {
          animation: glitch-overlay-anim-2 0.35s linear infinite;
          clip-path: inset(55% 0 20% 0);
          background-color: rgba(222, 237, 0, 0.15);
          transform: translateX(4px);
        }

        @keyframes glitch-overlay-anim-1 {
          0% { clip-path: inset(35% 0 45% 0); transform: translate(-3px, 1px); }
          20% { clip-path: inset(12% 0 78% 0); transform: translate(3px, -1px); }
          40% { clip-path: inset(68% 0 22% 0); transform: translate(-2px, -3px); }
          60% { clip-path: inset(28% 0 58% 0); transform: translate(2px, 3px); }
          80% { clip-path: inset(78% 0 7% 0); transform: translate(-3px, -1px); }
          100% { clip-path: inset(22% 0 68% 0); transform: translate(3px, 2px); }
        }

        @keyframes glitch-overlay-anim-2 {
          0% { clip-path: inset(22% 0 68% 0); transform: translate(3px, -1px); }
          25% { clip-path: inset(78% 0 7% 0); transform: translate(-3px, 1px); }
          50% { clip-path: inset(28% 0 58% 0); transform: translate(2px, -3px); }
          75% { clip-path: inset(68% 0 22% 0); transform: translate(-2px, 3px); }
          100% { clip-path: inset(12% 0 78% 0); transform: translate(3px, -1px); }
        }

        /* Printable custom CSS layout */
        @media print {
          /* Hide everything in app except the print card container */
          body * {
            visibility: hidden;
            background: none !important;
            box-shadow: none !important;
          }
          #id-card-printable, #id-card-printable * {
            visibility: visible;
          }
          #id-card-printable {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1.4);
            border: 2px solid #00f0ff !important;
            background: #0d0d10 !important;
            color: #ffffff !important;
            box-shadow: none !important;
            border-radius: 16px !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          /* Override general black/white printing rules to keep the dark mode game sci-fi style intact! */
          html, body {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
        }
      `}</style>

      {/* Zoom Modal (View Large) */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Tech UI surrounding the card */}
            <div className="w-full max-w-2xl text-center mb-4 text-gray-500 font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Identity Terminal Viewer v4.26 // Click outside to close</span>
            </div>

            {/* Center zoom element */}
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1.1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="relative w-full max-w-[600px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Standard ID Card copy but slightly larger */}
              <div
                onMouseEnter={playGlitchSound}
                className="w-full aspect-[1.6/1] bg-gradient-to-br from-[#0c0c0e] via-[#121216] to-[#070709] border-2 border-[#00f0ff] rounded-2xl p-7 shadow-[0_0_60px_rgba(0,240,255,0.3)] relative overflow-hidden flex flex-col justify-between id-card-hover group cursor-pointer"
              >
                {/* Cybernetic Glitch Overlays */}
                <div className="glitch-overlay glitch-overlay-1 pointer-events-none" />
                <div className="glitch-overlay glitch-overlay-2 pointer-events-none" />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-50" />
                <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-[#deed00]" />
                <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-[#deed00]" />
                <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-[#deed00]" />
                <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-[#deed00]" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-500/30 shadow-[0_0_10px_#00f0ff] animate-scan-sweep pointer-events-none" />

                <div className="flex justify-between items-center border-b border-[#00f0ff]/30 pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-[#deed00]" />
                    <div>
                      <span className="font-mono text-[9px] text-[#00f0ff] uppercase tracking-wider block">MPLS CYBER ACADEMY 2026</span>
                      <span className="glitch-text font-sans text-xs font-black text-white tracking-widest uppercase block">NEURAL ACCESS CARD</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[8px] text-gray-500 block leading-none">ROLE SEC_LEVEL</span>
                    <span className="glitch-text font-mono text-[11px] text-[#deed00] font-black uppercase tracking-wider">
                      {agent.role === 'admin' ? 'SYSTEM_OVERLORD' : 'STUDENT_CLASS_A'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-5 items-center my-4">
                  <div className="col-span-4 flex flex-col items-center">
                    <div className="relative w-28 h-28 rounded-lg overflow-hidden border border-[#00f0ff]/40 bg-black/50 p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.15)] group">
                      <img className="glitch-avatar w-full h-full object-cover rounded" src={agent.avatar || SCIFI_AVATARS[0]} alt="Facetag" />
                    </div>
                  </div>
                  <div className="col-span-8 space-y-2.5">
                    <div>
                      <span className="font-mono text-[8px] text-gray-500 uppercase block">Nama Lengkap // Full Name</span>
                      <span className="glitch-text font-sans text-base font-black text-white tracking-wide uppercase block">
                        {agent.fullName || agent.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-mono text-[8px] text-gray-500 uppercase block">Code Name Alias</span>
                        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase">{agent.name}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-gray-500 uppercase block">NIS ID</span>
                        <span className="font-mono text-xs text-[#deed00] font-bold">{agent.nis || 'PANITIA-9922'}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="font-mono text-[8px] text-gray-500 uppercase block">Major Dept</span>
                        <span className="font-mono text-xs text-white font-semibold uppercase">{agent.jurusan || 'SYS ADMIN'}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[8px] text-gray-500 uppercase block">Guild Faksi</span>
                        <span className="font-mono text-xs text-[#00f0ff] font-bold uppercase flex items-center gap-1">
                          <GuildIcon guildName={agent.guild} className="w-3.5 h-3.5" />
                          {agent.guild}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-gray-800/80 pt-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-sm border border-black/40" />
                    <span className="font-mono text-[7px] text-gray-500">BIOMETRIC SYNC // ACTIVE</span>
                  </div>
                  <div className="flex gap-2.5 items-center">
                    <div className="text-right">
                      <span className="font-mono text-[7px] text-gray-500 block">Neural Rank</span>
                      <span className="font-mono text-xs text-white font-bold block">LVL {agent.level}</span>
                    </div>
                    <div className="w-6 h-6 rounded bg-[#deed00] text-black font-mono text-[10px] font-black flex items-center justify-center">
                      {agent.level}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick close link helper */}
            <span className="mt-6 font-mono text-[10px] text-gray-500 uppercase tracking-widest cursor-pointer hover:text-white transition-colors">
              Click anywhere to close terminal viewer
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
