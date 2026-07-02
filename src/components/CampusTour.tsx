/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Copy, Check, Radio, Award, Compass, ArrowLeft } from 'lucide-react';

interface Sector {
  id: string;
  name: string;
  room: string;
  coords: string;
  code: string;
  questName: string;
  description: string;
  details: string[];
  image: string;
}

const SECTORS: Sector[] = [
  {
    id: 'sec-1',
    name: 'Main Assembly Plaza',
    room: 'Plaza Alpha-9',
    coords: 'SYS.LOC: 35.1092, 12.0042',
    code: 'APEL-07',
    questName: 'Apel Pagi',
    description: 'The grand central square where agents meet every morning for neural frequency calibration.',
    details: ['Digital columns broadcast schedule alerts.', 'Atmospheric scrubbers filter simulated particulate pollution.', 'Equipped with heavy-duty holographic emitters.'],
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sec-2',
    name: 'Advanced Cybernetics Lab',
    room: 'Lab Room 303',
    coords: 'SYS.LOC: 42.9981, -8.7610',
    code: 'TOUR-09',
    questName: 'Tour Lab',
    description: 'State-of-the-art laboratory for structural robotics, mechanical prosthesis tuning, and AI training.',
    details: ['Industrial fabrication arms printing carbon nanoframes.', 'Tactile biomechanical interface pods.', 'Quantum processing nodes cooled with liquid nitrogen.'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sec-3',
    name: 'Holographic Lecture Hall',
    room: 'Auditorium Omega',
    coords: 'SYS.LOC: 10.4215, 144.9210',
    code: 'SEMINAR-14',
    questName: 'Seminar',
    description: 'High-density classroom leveraging direct ocular projection for interactive high-speed lecturing.',
    details: ['Holographic presentation boards.', 'Direct neural link docking chairs.', 'Atmospheric synthesis simulating variable environments.'],
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sec-4',
    name: 'Synthetic Intelligence Ward',
    room: 'Server Block B-12',
    coords: 'SYS.LOC: -5.1129, 102.4089',
    code: 'AI-2026',
    questName: 'AI Workshop',
    description: 'Secure, air-gapped facility housing the core neural nets of the school’s persistent tutor agents.',
    details: ['Massive data center racks processing petabytes of synaptic models.', 'Advanced optical interconnect grids.', 'Direct interface terminals for synthetic agents.'],
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=400&auto=format&fit=crop'
  }
];

interface CampusTourProps {
  onBack: () => void;
  onEnterHUD: () => void;
}

export default function CampusTour({ onBack, onEnterHUD }: CampusTourProps) {
  const [selectedSector, setSelectedSector] = useState<Sector>(SECTORS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const playBeep = (freq = 900, duration = 0.08) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    playBeep(1000, 0.12);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <button
            onClick={() => {
              playBeep(400, 0.1);
              onBack();
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-[#00f0ff] font-mono text-xs uppercase tracking-wider mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Welcome Gate
          </button>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-white tracking-tight">
            Augmented Reality <span className="text-[#00f0ff]">Campus Map</span>
          </h1>
        </div>

        <button
          onClick={() => {
            playBeep(800, 0.1);
            onEnterHUD();
          }}
          className="bg-transparent border border-[#deed00] hover:bg-[#deed00]/10 text-[#deed00] px-6 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest transition-all"
        >
          Initialize Mission HUD
        </button>
      </div>

      {/* Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Sector List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-widest pb-2 border-b border-gray-800">
            <Compass className="w-4 h-4 text-[#deed00] animate-spin" />
            Active Map Sectors
          </div>

          <div className="space-y-3">
            {SECTORS.map((sector) => {
              const isSelected = selectedSector.id === sector.id;
              return (
                <button
                  key={sector.id}
                  onClick={() => {
                    playBeep(700, 0.06);
                    setSelectedSector(sector);
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-[#131315] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                      : 'bg-black/40 border-gray-800/80 hover:border-gray-700 hover:bg-black/60'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#00f0ff]' : 'text-gray-500'}`} />
                        <span className={`font-sans text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                          {sector.name}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-gray-500 block uppercase tracking-wider">
                        {sector.room}
                      </span>
                    </div>
                    <span className="bg-[#deed00]/10 text-[#deed00] px-2 py-0.5 rounded text-[9px] font-mono font-bold">
                      {sector.questName}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive instruction banner */}
          <div className="bg-[#131315]/80 border border-[#deed00]/20 p-4 rounded-lg">
            <h4 className="font-sans text-xs font-bold text-[#deed00] mb-1 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse text-[#deed00]" />
              Simulation Instruction
            </h4>
            <p className="text-[11px] text-gray-400 font-mono leading-relaxed">
              Find each sector's specific access code, copy it to your terminal clipboard, and enter it in the scanner interface on your Mission HUD to fulfill daily registration quests!
            </p>
          </div>
        </div>

        {/* Right column: Selected Sector Viewport */}
        <div className="lg:col-span-7">
          <motion.div
            key={selectedSector.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#131315]/90 border border-gray-800 rounded-xl overflow-hidden shadow-xl"
          >
            {/* Sector Image Banner */}
            <div className="h-48 md:h-64 relative bg-black">
              <img
                src={selectedSector.image}
                alt={selectedSector.name}
                className="w-full h-full object-cover opacity-60 blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#131315]/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                <div>
                  <span className="text-[#00f0ff] font-mono text-[10px] tracking-widest uppercase block mb-1">
                    {selectedSector.coords}
                  </span>
                  <h2 className="font-sans text-xl md:text-2xl font-bold text-white tracking-wide uppercase">
                    {selectedSector.name}
                  </h2>
                </div>
              </div>
            </div>

            {/* Sector Details */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="font-sans text-sm text-gray-300 leading-relaxed">
                  {selectedSector.description}
                </p>
              </div>

              {/* Schematic Breakdown */}
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-gray-500 tracking-widest uppercase block">
                  Schematic Highlights
                </span>
                <ul className="space-y-2.5">
                  {selectedSector.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-mono text-gray-400">
                      <span className="text-[#deed00] mt-0.5 font-bold">»</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code Panel */}
              <div className="bg-black/60 border border-gray-800 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest block mb-0.5">
                    Terminal Access Code
                  </span>
                  <span className="font-mono text-lg font-bold text-white tracking-widest">
                    {selectedSector.code}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(selectedSector.code)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-widest transition-all ${
                    copiedCode === selectedSector.code
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#deed00] hover:bg-[#deed00]/90 text-black shadow-[0_0_10px_rgba(222,237,0,0.2)]'
                  }`}
                >
                  {copiedCode === selectedSector.code ? (
                    <>
                      <Check className="w-4 h-4" />
                      COPIED!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      COPY CODE
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
