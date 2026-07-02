/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Cpu, Globe, Users, ChevronRight, Sparkles, User, Shield, Terminal, BookOpen, FileText } from 'lucide-react';
import { Agent, AVAILABLE_GUILDS, MOCK_AVATARS } from '../types';
import GuildIcon from './GuildIcon';

interface WelcomeGateProps {
  agent: Agent;
  onRegister: (updatedAgent: Partial<Agent>) => void;
  onEnterHUD: () => void;
  onOpenTour: () => void;
}

export default function WelcomeGate({ agent, onRegister, onEnterHUD, onOpenTour }: WelcomeGateProps) {
  const [showReg, setShowReg] = useState(false);
  const [tempName, setTempName] = useState(agent.name || 'Arjuna Wibowo');
  const [tempFullName, setTempFullName] = useState(agent.fullName || '');
  const [tempNis, setTempNis] = useState(agent.nis || '');
  const [tempJurusan, setTempJurusan] = useState(agent.jurusan || 'RPL');
  const [tempGuild, setTempGuild] = useState(agent.guild || AVAILABLE_GUILDS[0]);
  const [tempAvatar, setTempAvatar] = useState(agent.avatar || MOCK_AVATARS[0]);

  // Sci-fi sound generator
  const playBeep = (freq = 800, type: OscillatorType = 'sine', duration = 0.1) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context blocked or not supported
    }
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!tempName.trim() || !tempFullName.trim() || !tempNis.trim()) return;

    // Neural registration chime
    playBeep(400, 'sawtooth', 0.15);
    setTimeout(() => playBeep(800, 'sine', 0.25), 100);
    setTimeout(() => playBeep(1200, 'sine', 0.4), 200);

    onRegister({
      name: tempName,
      fullName: tempFullName,
      nis: tempNis,
      jurusan: tempJurusan,
      guild: tempGuild,
      avatar: tempAvatar,
      status: 'NEURAL SYNCED',
      level: 1,
      exp: 0
    });
    setShowReg(false);
    onEnterHUD();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Sci-fi Overlay Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-3xl flex flex-col gap-8 relative z-10 text-center"
      >
        {/* Upper Badge */}
        <div className="inline-flex items-center justify-center gap-2 self-center px-4 py-1 bg-black/40 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs uppercase tracking-[0.2em] rounded-full backdrop-blur-md">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          Orientation Protocol: Active
        </div>

        {/* Central Welcoming Banner */}
        <div className="relative border-2 border-[#deed00] bg-black/75 p-8 md:p-12 rounded-xl shadow-[0_0_30px_rgba(222,237,0,0.15)] backdrop-blur-lg">
          {/* Custom corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00f0ff]" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00f0ff]" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00f0ff]" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00f0ff]" />

          {/* Yellow Highlight Banner */}
          <div className="inline-block px-4 py-1.5 bg-[#deed00] text-black text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] uppercase rounded mb-6">
            MPLS 2026
          </div>

          <h1 className="font-sans text-xs md:text-sm font-semibold text-[#deed00] tracking-[0.25em] uppercase mb-4">
            MPLS 2026: Future Focused Orientation - Cyberpunk School
          </h1>

          <h2 className="font-sans text-3xl md:text-6xl font-black text-white tracking-wide leading-tight uppercase">
            Welcome, <span className="text-[#deed00]">Class of '26</span>
          </h2>

          <p className="mt-4 text-xs md:text-sm text-gray-400 font-mono max-w-xl mx-auto">
            Synchronize your synthetic implants, select your tactical guild, and begin the campus exploration logs.
          </p>
        </div>

        {/* Buttons / Expandable Area */}
        {!showReg ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto w-full">
            <button
              onClick={() => {
                playBeep(600, 'sine', 0.15);
                onOpenTour();
              }}
              className="group flex-1 w-full flex items-center justify-center gap-3 py-4 border border-[#00f0ff]/50 hover:border-[#00f0ff] hover:bg-[#00f0ff]/10 text-[#00f0ff] font-mono text-xs uppercase tracking-widest rounded-lg transition-all duration-300 backdrop-blur-md"
            >
              <Globe className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
              AR Campus Tour
            </button>

            <button
              onClick={() => {
                playBeep(900, 'sine', 0.15);
                if (agent.status !== 'NEURAL SYNCED') {
                  setShowReg(true);
                } else {
                  onEnterHUD();
                }
              }}
              className="flex-1 w-full flex items-center justify-center gap-3 py-4 bg-[#deed00] hover:bg-[#deed00]/90 text-black font-mono text-xs font-bold uppercase tracking-widest rounded-lg shadow-[0_0_15px_rgba(222,237,0,0.3)] hover:shadow-[0_0_25px_rgba(222,237,0,0.5)] transition-all duration-300"
            >
              <Cpu className="w-4 h-4" />
              {agent.status === 'NEURAL SYNCED' ? 'Enter HUD' : 'Neural Link'}
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg mx-auto bg-[#131315]/90 border border-gray-800 p-6 md:p-8 rounded-xl text-left backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#deed00]" />
                Neural ID Implantation
              </h3>
              <button
                onClick={() => {
                  playBeep(300, 'sine', 0.1);
                  setShowReg(false);
                }}
                className="text-gray-500 hover:text-white font-mono text-xs"
              >
                [CANCEL]
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              {/* Full Name field */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Nama Lengkap (Full Name)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 focus:border-[#00f0ff] text-white px-10 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors"
                    placeholder="Nama lengkap Anda..."
                  />
                </div>
              </div>

              {/* Alias / Code Name field */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Agent Alias / Code Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 focus:border-[#00f0ff] text-white px-10 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors"
                    placeholder="Enter agent code name..."
                  />
                </div>
              </div>

              {/* NIS Field */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Nomor Induk Siswa (NIS)</label>
                <div className="relative">
                  <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    required
                    value={tempNis}
                    onChange={(e) => setTempNis(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 focus:border-[#00f0ff] text-white px-10 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors"
                    placeholder="Contoh: 12453"
                  />
                </div>
              </div>

              {/* Jurusan Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Pilih Jurusan</label>
                <div className="relative">
                  <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <select
                    value={tempJurusan}
                    onChange={(e) => setTempJurusan(e.target.value)}
                    className="w-full bg-black/60 border border-gray-800 focus:border-[#00f0ff] text-white px-10 py-3 rounded-lg font-sans text-sm focus:outline-none transition-colors appearance-none"
                  >
                    <option value="RPL" className="bg-[#131315]">Rekayasa Perangkat Lunak (RPL)</option>
                    <option value="DPB" className="bg-[#131315]">Desain Pemodelan dan Informasi Bangunan (DPB)</option>
                    <option value="TKJ" className="bg-[#131315]">Teknik Komputer dan Jaringan (TKJ)</option>
                    <option value="DKV" className="bg-[#131315]">Desain Komunikasi Visual (DKV)</option>
                    <option value="TITL" className="bg-[#131315]">Teknik Instalasi Tenaga Listrik (TITL)</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Select Tactile Avatar</label>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {MOCK_AVATARS.map((av, index) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        playBeep(700 + index * 50, 'sine', 0.05);
                        setTempAvatar(av);
                      }}
                      className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        tempAvatar === av ? 'border-[#deed00] scale-105' : 'border-gray-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={av} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                      {tempAvatar === av && (
                        <div className="absolute inset-0 bg-[#deed00]/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#deed00]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Guild Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">Assign Tactical Guild</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {AVAILABLE_GUILDS.map((guild) => {
                    const isSelected = tempGuild === guild;
                    return (
                      <button
                        key={guild}
                        type="button"
                        onClick={() => {
                          playBeep(500, 'sine', 0.05);
                          setTempGuild(guild);
                        }}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-[#00f0ff] bg-[#00f0ff]/5 text-white'
                            : 'border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <GuildIcon guildName={guild} className="w-5 h-5 flex-shrink-0" />
                          <span className="font-sans text-xs font-semibold">{guild}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all"
              >
                Incorporate Neural Sync
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
