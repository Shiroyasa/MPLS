/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, CheckCircle, Edit3, Save, X, RotateCcw, FileText, Terminal, BookOpen, Upload } from 'lucide-react';
import { Agent, AVAILABLE_GUILDS, MOCK_AVATARS, SCIFI_AVATARS } from '../types';
import GuildIcon from './GuildIcon';

interface AgentStatusProps {
  agent: Agent;
  lastCheckIn?: string;
  onUpdateAgent: (updatedAgent: Partial<Agent>) => void;
  onReset: () => void;
}

export default function AgentStatus({ agent, lastCheckIn, onUpdateAgent, onReset }: AgentStatusProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(agent.name);
  const [editFullName, setEditFullName] = useState(agent.fullName || '');
  const [editNis, setEditNis] = useState(agent.nis || '');
  const [editJurusan, setEditJurusan] = useState(agent.jurusan || 'RPL');
  const [editGuild, setEditGuild] = useState(agent.guild);
  const [editAvatar, setEditAvatar] = useState(agent.avatar);

  // Calculate leveling (100 XP per level)
  const xpInCurrentLevel = agent.exp % 100;
  const currentLevel = Math.floor(agent.exp / 100) + 1;
  const totalSegments = 12;
  const activeSegmentsCount = Math.round((xpInCurrentLevel / 100) * totalSegments);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    onUpdateAgent({
      name: editName,
      fullName: editFullName,
      nis: editNis,
      jurusan: editJurusan,
      guild: editGuild,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white">Current Agent Status</h2>

      <div className="border border-[#929277]/30 bg-black/75 p-6 rounded-xl flex flex-col gap-6 relative overflow-hidden backdrop-blur-md">
        {/* Verification seal logo watermark */}
        <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
          <Shield className="w-40 h-40" />
        </div>

        {/* Edit Form Toggle */}
        <AnimatePresence mode="wait">
          {!isEditing ? (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Agent info row */}
              <div className="flex items-center gap-6 relative z-10">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border border-[#929277]/30 group bg-black/40">
                  <img
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                    src={agent.avatar || MOCK_AVATARS[0]}
                    alt="Agent Avatar"
                  />
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <Edit3 className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                      Agent Alias
                    </span>
                    <button
                      onClick={() => {
                        setEditName(agent.name);
                        setEditGuild(agent.guild);
                        setEditAvatar(agent.avatar);
                        setIsEditing(true);
                      }}
                      className="text-gray-400 hover:text-[#00f0ff] p-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="font-sans text-xl md:text-2xl font-black text-white tracking-wide uppercase">
                    {agent.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="bg-[#2ae500]/20 text-[#2ae500] border border-[#2ae500]/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Level {currentLevel}
                    </span>
                    <span className="text-[#00f0ff] font-mono text-[11px] tracking-wider font-semibold">
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Student Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-black/60 p-3.5 rounded-lg border border-gray-800/80">
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Nama Lengkap</p>
                  <p className="font-sans text-xs text-white font-semibold truncate mt-0.5">
                    {agent.fullName || '-'}
                  </p>
                </div>
                <div className="bg-black/60 p-3.5 rounded-lg border border-gray-800/80">
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">NIS (Student ID)</p>
                  <p className="font-mono text-xs text-[#deed00] font-bold mt-0.5">
                    {agent.nis || '-'}
                  </p>
                </div>
                <div className="bg-black/60 p-3.5 rounded-lg border border-gray-800/80">
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Jurusan (Major)</p>
                  <p className="font-sans text-xs text-[#00f0ff] font-bold mt-0.5">
                    {agent.jurusan || '-'}
                  </p>
                </div>
              </div>

              {/* Guild and Status indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-black/60 p-4 rounded-lg border-l-4 border-[#00f0ff] flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">GUILD UNIT</p>
                    <p className="font-sans text-xs text-[#00f0ff] font-bold uppercase mt-0.5">
                      {agent.guild}
                    </p>
                  </div>
                  <GuildIcon guildName={agent.guild} className="w-8 h-8" />
                </div>
                <div className="bg-black/60 p-4 rounded-lg border-l-4 border-[#2ae500]">
                  <p className="font-mono text-[9px] text-gray-500 uppercase tracking-wider">STATUS</p>
                  <p className="font-sans text-xs text-[#2ae500] font-bold uppercase mt-0.5">
                    READY TO DISCOVER
                  </p>
                </div>
              </div>

              {/* EXP Progress segments */}
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                  <span>EXP Progress</span>
                  <span className="text-[#2ae500] font-bold">{xpInCurrentLevel}% ({agent.exp} EXP Total)</span>
                </div>

                <div className="flex gap-[3px] w-full">
                  {Array.from({ length: totalSegments }).map((_, index) => {
                    const isActive = index < activeSegmentsCount;
                    return (
                      <div
                        key={index}
                        className={`h-2 flex-grow rounded-sm transition-all duration-500 ${
                          isActive
                            ? 'bg-[#2ae500] shadow-[0_0_6px_#2ae500]'
                            : 'bg-gray-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Last Check-In */}
              <div className="pt-4 border-t border-gray-800/60">
                <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                  Last Registered Activity
                </p>
                <div className="flex items-center justify-between font-mono text-xs text-gray-400">
                  <span>{lastCheckIn || 'No registration activity logged yet.'}</span>
                  {lastCheckIn && (
                    <span className="text-[#2ae500] flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3.5 h-3.5 fill-[#2ae500]/20" />
                      SUCCESS
                    </span>
                  )}
                </div>
              </div>

              {/* Reset Sync Option */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={onReset}
                  className="flex items-center gap-1 text-[9px] font-mono text-gray-600 hover:text-red-400 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  [FORMAT NEURAL CODES]
                </button>
              </div>
            </motion.div>
          ) : (
            /* Editing State view */
            <motion.div
              key="edit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#00f0ff] mb-2 border-b border-gray-800 pb-1">
                Modify Tactical Profile
              </h3>

              {/* Edit Full Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                />
              </div>

              {/* Edit Name */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Alias Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                />
              </div>

              {/* Edit NIS */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Nomor Induk Siswa (NIS)</label>
                <input
                  type="text"
                  required
                  value={editNis}
                  onChange={(e) => setEditNis(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                />
              </div>

              {/* Edit Jurusan */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Jurusan</label>
                <select
                  value={editJurusan}
                  onChange={(e) => setEditJurusan(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-xs focus:outline-none"
                >
                  <option value="RPL">Rekayasa Perangkat Lunak (RPL)</option>
                  <option value="DPB">Desain Pemodelan dan Informasi Bangunan (DPB)</option>
                  <option value="TKJ">Teknik Komputer dan Jaringan (TKJ)</option>
                  <option value="DKV">Desain Komunikasi Visual (DKV)</option>
                  <option value="TITL">Teknik Instalasi Tenaga Listrik (TITL)</option>
                </select>
              </div>

              {/* Edit Avatar */}
              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Tactical Faceprint (Choose Sci-Fi Game Avatar)</label>
                <div className="flex gap-2 py-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800">
                  {SCIFI_AVATARS.map((av, idx) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditAvatar(av)}
                      className={`relative w-12 h-12 rounded border transition-all flex-shrink-0 ${
                        editAvatar === av ? 'border-[#deed00] scale-105 shadow-[0_0_10px_rgba(222,237,0,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title={`Sci-Fi Avatar ${idx + 1}`}
                    >
                      <img src={av} alt="Avatar Selection" className="w-full h-full object-cover rounded" />
                    </button>
                  ))}
                </div>

                <div className="mt-2">
                  <label className="block text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-1">Or Upload Custom Avatar</label>
                  <label className="flex items-center gap-2 justify-center border border-dashed border-gray-800 hover:border-[#00f0ff] bg-black/40 hover:bg-black/80 text-gray-400 hover:text-white px-3 py-2 rounded cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-[#00f0ff]" />
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Upload Profile Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Edit Guild */}
              <div className="space-y-1">
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Guild Division</label>
                <select
                  value={editGuild}
                  onChange={(e) => setEditGuild(e.target.value)}
                  className="w-full bg-black border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-xs focus:outline-none"
                >
                  {AVAILABLE_GUILDS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/95 text-black font-mono text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-800 text-gray-400 hover:text-white font-mono text-xs uppercase rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
