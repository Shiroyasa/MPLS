/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Users, Radio, Award, Terminal, ArrowRight, Activity, Zap, Layers,
  Image as ImageIcon, FolderArchive, Calendar, User, Tag, Lock, X, Eye
} from 'lucide-react';
import { ActivityPhoto } from '../types';

interface LandingPageProps {
  onEnterPortal: () => void;
  activities: ActivityPhoto[];
}

export default function LandingPage({ onEnterPortal, activities = [] }: LandingPageProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<ActivityPhoto | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Synthesize terminal alert chime
  const playBeep = (freq = 880, duration = 0.15, vol = 0.05) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const handleCardClick = (photo: ActivityPhoto) => {
    playBeep(980, 0.1, 0.04);
    setSelectedPhoto(photo);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-between px-6 py-12 md:py-20 relative overflow-hidden">
      {/* Sci-fi grids & neon light circles */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_70%_30%,rgba(0,240,255,0.06)_0%,transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_80%,rgba(222,237,0,0.05)_0%,transparent_60%)]" />

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto w-full z-10 space-y-24">
        {/* Top Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
          {/* Left Side: Hero Text & Call to Action */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Cyber Alert Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-black/40 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs uppercase tracking-[0.2em] rounded-full backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
              SECURE LINK PORTAL ENCRYPTION ACTIVE
            </motion.div>

            {/* Hero Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[1.1] uppercase tracking-tight"
              >
                MPLS 2026: <br />
                <span className="text-[#deed00] relative">
                  CYBER PUNK
                  <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-[#deed00]/40 rounded" />
                </span>{' '}
                ACADEMY
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-mono text-xs sm:text-sm text-gray-400 max-w-xl leading-relaxed"
              >
                Selamat datang di portal orientasi multi-user hibrida MPLS 2026. Integrasikan implan kognitif faksi Anda, pantau quests harian melalui pemindai waktu-nyata, dan bersaing dalam papan peringkat global.
              </motion.p>
            </div>

            {/* Central CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <button
                onClick={() => {
                  playBeep(880, 0.15, 0.05);
                  onEnterPortal();
                }}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#deed00] hover:bg-[#deed00]/90 text-black font-mono text-xs font-black uppercase tracking-[0.2em] rounded-lg transition-all duration-300 shadow-[0_0_20px_rgba(222,237,0,0.3)] hover:shadow-[0_0_35px_rgba(222,237,0,0.5)] transform hover:-translate-y-0.5"
              >
                Enter System Portal
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <div className="flex items-center gap-3 px-5 py-3 bg-[#131315]/80 border border-gray-800 rounded-lg text-xs font-mono text-gray-400">
                <Terminal className="w-4 h-4 text-[#00f0ff] animate-pulse" />
                <span>SYS_INIT: OK_READY_2026</span>
              </div>
            </motion.div>

            {/* Tech Spec Rows */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-800/60 max-w-lg"
            >
              <div>
                <span className="font-sans text-xl sm:text-2xl font-bold text-white block">4+ Guilds</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase">Unit Divisions</span>
              </div>
              <div>
                <span className="font-sans text-xl sm:text-2xl font-bold text-[#00f0ff] block">Live Sync</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase">Scanner Active</span>
              </div>
              <div>
                <span className="font-sans text-xl sm:text-2xl font-bold text-[#deed00] block">Dual-Role</span>
                <span className="font-mono text-[10px] text-gray-500 uppercase">Siswa & Admin</span>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Immersive Status Widget / Visual Representation */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="border border-[#00f0ff]/20 bg-black/80 p-6 rounded-2xl relative shadow-2xl backdrop-blur-md"
            >
              {/* Custom UI corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#00f0ff]" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#deed00]" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#deed00]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#00f0ff]" />

              {/* Simulated Live Feed Header */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4 font-mono text-[10px] text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  SERVER METRIC TELEMETRY
                </span>
                <span>SYS_T: 2026.07.02</span>
              </div>

              {/* Holographic Academy Core Status */}
              <div className="space-y-5">
                <div className="bg-[#131315]/80 p-4 border border-gray-800/80 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 uppercase">Active Operatives</span>
                    <span className="text-[#00f0ff] font-bold">1,422 Syncs</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded overflow-hidden mt-1">
                    <div className="bg-[#00f0ff] h-full w-[78%] rounded animate-pulse" />
                  </div>
                </div>

                <div className="bg-[#131315]/80 p-4 border border-gray-800/80 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-gray-400 uppercase">Quests Completed Today</span>
                    <span className="text-[#deed00] font-bold">4,892 Scans</span>
                  </div>
                  <div className="w-full bg-gray-900 h-1.5 rounded overflow-hidden mt-1">
                    <div className="bg-[#deed00] h-full w-[92%] rounded" />
                  </div>
                </div>

                {/* Real-time Event simulation */}
                <div className="bg-black/40 border border-gray-800/80 p-4 rounded-xl space-y-2.5 font-mono text-xs">
                  <span className="text-gray-500 text-[9px] uppercase tracking-wider block">
                    LATEST ENCRYPTED SYNC LOGS
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-emerald-400">
                      <span>» Arjuna Wibowo</span>
                      <span>SUCCESS TOUR-09</span>
                    </div>
                    <div className="flex justify-between text-[#00f0ff]">
                      <span>» Reza Cyberpunk</span>
                      <span>LEVEL UP (16)</span>
                    </div>
                    <div className="flex justify-between text-[#deed00]">
                      <span>» SYSTEM OVERLORD</span>
                      <span>BROADCAST ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Holographic Logo seal watermark background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <Shield className="w-60 h-60" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* NEURAL ARCHIVE MEMORY VAULT SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="space-y-8 text-left border-t border-gray-800/60 pt-16"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#deed00] font-mono text-xs tracking-[0.2em] uppercase">
                <FolderArchive className="w-4 h-4 text-[#deed00] animate-pulse" />
                // DATABASE CORE: ARCHIVE DECRYPTS
              </div>
              <h2 className="font-display text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                NEURAL MEMORY VAULT
              </h2>
              <p className="font-mono text-xs text-gray-500 max-w-xl">
                Arsip visual digital dari aktivitas pembelajaran, pembukaan orientasi, dan kompetisi hulu-hilir di MPLS Cyber Academy 2026.
              </p>
            </div>
            <div className="bg-black/30 border border-[#00f0ff]/30 rounded-lg px-4 py-2 font-mono text-[10px] text-gray-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activities.length} SECTORS DECRYPTED</span>
            </div>
          </div>

          {/* Photos Grid */}
          {activities.length === 0 ? (
            <div className="border border-dashed border-gray-800 p-12 rounded-xl text-center space-y-3">
              <ImageIcon className="w-8 h-8 text-gray-600 mx-auto" />
              <div className="font-mono text-xs text-gray-500">NO SECURE MEMORIES LOADED IN DATABASE SYSTEM</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity, idx) => {
                const isHovered = hoveredCardId === activity.id;
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="group bg-[#0d0d0f]/90 border border-gray-800/80 hover:border-[#00f0ff]/60 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all duration-300 flex flex-col relative cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredCardId(activity.id);
                    }}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onClick={() => handleCardClick(activity)}
                  >
                    {/* Futuristic scanline / glitch card highlight on hover */}
                    {isHovered && (
                      <>
                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#deed00] z-20" />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00f0ff] z-20" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00f0ff] z-20" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#deed00] z-20" />
                      </>
                    )}

                    {/* Image Area with sci-fi overlays */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/40 border-b border-gray-800/60">
                      {/* Scanline overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] z-10 pointer-events-none opacity-40" />

                      <img
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:filter group-hover:hue-rotate-[10deg]"
                      />

                      {/* Floating Cyber Tag */}
                      <div className="absolute top-3 left-3 bg-black/75 border border-gray-800 rounded px-2 py-0.5 font-mono text-[9px] text-gray-400 z-10 flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-[#deed00]" />
                        <span>{activity.encryptionCode || `SEC-${activity.id}`}</span>
                      </div>

                      {/* View Decrypt Trigger */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                        <div className="bg-black/90 border border-[#00f0ff] text-[#00f0ff] font-mono text-[10px] tracking-wider uppercase px-4 py-2 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Decrypt Memory</span>
                        </div>
                      </div>
                    </div>

                    {/* Content text metadata */}
                    <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        {/* Tags list */}
                        <div className="flex flex-wrap gap-1.5">
                          {activity.tags?.slice(0, 3).map((tag, tIdx) => (
                            <span key={tIdx} className="font-mono text-[8px] bg-gray-900 text-[#00f0ff]/80 border border-[#00f0ff]/10 px-1.5 py-0.5 rounded uppercase">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <h3 className="font-sans text-sm font-black text-white group-hover:text-[#deed00] transition-colors uppercase tracking-wide line-clamp-1">
                          {activity.title}
                        </h3>

                        <p className="font-mono text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>

                      {/* Uploader / Date metadata footer */}
                      <div className="flex justify-between items-center border-t border-gray-900 pt-3 font-mono text-[9px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#deed00]" />
                          BY: {activity.uploader}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {activity.date}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* PHOTO DECRYPTOR INTERACTIVE MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl bg-[#0c0c0e] border-2 border-[#00f0ff] rounded-2xl relative shadow-[0_0_60px_rgba(0,240,255,0.25)] overflow-hidden flex flex-col"
            >
              {/* Cybermatic design lines */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#deed00] pointer-events-none" />
              <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#00f0ff] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#00f0ff] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#deed00] pointer-events-none" />

              {/* Modal header with decrypt diagnostics */}
              <div className="bg-black/60 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-mono text-[10px] sm:text-xs text-gray-400 tracking-widest uppercase">
                    SYSTEM MEMORY_DECRYPT: SEC-{selectedPhoto.id} [COMPLETE]
                  </span>
                </div>
                <button
                  onClick={() => {
                    playBeep(600, 0.1, 0.04);
                    setSelectedPhoto(null);
                  }}
                  className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Visual Image Viewport */}
                <div className="relative aspect-[4/3] md:aspect-square bg-black overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[size:100%_4px] z-10 pointer-events-none" />
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={selectedPhoto.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Scope Overlay detail */}
                  <div className="absolute top-4 left-4 font-mono text-[8px] text-[#00f0ff] bg-black/60 px-2 py-1 rounded border border-[#00f0ff]/30">
                    DIAG_VIEWPORT // 400HZ
                  </div>
                </div>

                {/* Information Decrypt Panel */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4 text-left">
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono text-[#deed00] tracking-widest uppercase">
                        // SECURE DECRYPT SECTOR
                      </div>
                      <h3 className="text-xl font-black font-sans text-white tracking-wide uppercase">
                        {selectedPhoto.title}
                      </h3>
                    </div>

                    <p className="font-mono text-xs text-gray-400 leading-relaxed max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedPhoto.description}
                    </p>

                    {/* Tags */}
                    <div className="space-y-1.5">
                      <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                        Archive Metadata Tags
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPhoto.tags?.map((tag, tIdx) => (
                          <span key={tIdx} className="font-mono text-[9px] bg-black border border-gray-800 text-emerald-400 px-2 py-0.5 rounded uppercase">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Encryption metadata parameters */}
                  <div className="space-y-4">
                    <div className="bg-black/40 border border-gray-800 p-3 rounded-lg grid grid-cols-2 gap-3 font-mono text-[10px]">
                      <div>
                        <div className="text-gray-500 uppercase">CHRONO DATE</div>
                        <div className="text-white mt-0.5">{selectedPhoto.date}</div>
                      </div>
                      <div>
                        <div className="text-gray-500 uppercase">ACCESS AUTHORITY</div>
                        <div className="text-white mt-0.5">{selectedPhoto.uploader}</div>
                      </div>
                      <div className="col-span-2 border-t border-gray-800/60 pt-2 mt-1">
                        <div className="text-gray-500 uppercase">VAULT SECTOR SIGNATURE</div>
                        <div className="text-[#00f0ff] font-bold mt-0.5 tracking-wider">
                          {selectedPhoto.encryptionCode || `SEC-${selectedPhoto.id}-NIL`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playBeep(600, 0.1, 0.04);
                        setSelectedPhoto(null);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-gray-900 to-black hover:from-[#00f0ff]/10 hover:to-transparent text-gray-400 hover:text-[#00f0ff] border border-gray-800 hover:border-[#00f0ff]/50 font-mono text-xs uppercase tracking-widest rounded-xl transition-all duration-300"
                    >
                      Close Decryptor Interface
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
