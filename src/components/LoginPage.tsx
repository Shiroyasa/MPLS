/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Key, User, Users, ChevronRight, Terminal, Sparkles, LogIn, Cpu } from 'lucide-react';
import { Agent, AVAILABLE_GUILDS, MOCK_AVATARS } from '../types';
import GuildIcon from './GuildIcon';

interface LoginPageProps {
  onLoginSiswa: (agent: Agent) => void;
  onLoginAdmin: () => void;
  onBackToLanding: () => void;
}

export default function LoginPage({ onLoginSiswa, onLoginAdmin, onBackToLanding }: LoginPageProps) {
  const [roleTab, setRoleTab] = useState<'siswa' | 'admin'>('siswa');
  const [isRegistering, setIsRegistering] = useState(false);

  // Student Login Fields
  const [selectedDemoIndex, setSelectedDemoIndex] = useState<number>(-1);
  const [customStudentName, setCustomStudentName] = useState('');

  // Student Registration Fields
  const [regName, setRegName] = useState('');
  const [regGuild, setRegGuild] = useState(AVAILABLE_GUILDS[0]);
  const [regAvatar, setRegAvatar] = useState(MOCK_AVATARS[0]);

  // Admin login credentials
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('cyber2026');
  const [adminError, setAdminError] = useState<string | null>(null);

  // Synthesize sci-fi sound effects
  const playSound = (freq = 800, type: OscillatorType = 'sine', duration = 0.1) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const demoStudents: Agent[] = [
    {
      name: 'Arjuna Wibowo',
      guild: 'Garuda',
      level: 1,
      exp: 0,
      avatar: MOCK_AVATARS[0],
      status: 'NEURAL SYNCED',
      role: 'siswa'
    },
    {
      name: 'Budi Jaringan',
      guild: 'Candi',
      level: 2,
      exp: 150,
      avatar: MOCK_AVATARS[2],
      status: 'NEURAL SYNCED',
      role: 'siswa'
    }
  ];

  const handleDemoSelect = (idx: number) => {
    setSelectedDemoIndex(idx);
    setCustomStudentName('');
    playSound(600, 'sine', 0.1);
  };

  const handleStudentSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (!regName.trim()) return;
      playSound(1000, 'sine', 0.2);
      onLoginSiswa({
        name: regName.trim(),
        guild: regGuild,
        level: 1,
        exp: 0,
        avatar: regAvatar,
        status: 'NEURAL SYNCED',
        role: 'siswa'
      });
    } else {
      // Login with selected demo or custom student
      if (selectedDemoIndex !== -1) {
        playSound(1000, 'sine', 0.2);
        onLoginSiswa(demoStudents[selectedDemoIndex]);
      } else if (customStudentName.trim()) {
        playSound(1000, 'sine', 0.2);
        onLoginSiswa({
          name: customStudentName.trim(),
          guild: AVAILABLE_GUILDS[0], // default Garuda
          level: 1,
          exp: 0,
          avatar: MOCK_AVATARS[1],
          status: 'NEURAL SYNCED',
          role: 'siswa'
        });
      }
    }
  };

  const handleAdminSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAdminError(null);

    if (adminUsername.trim() === 'admin' && (adminPassword === 'admin' || adminPassword === 'cyber2026')) {
      playSound(1200, 'sine', 0.3);
      onLoginAdmin();
    } else {
      playSound(300, 'sawtooth', 0.25);
      setAdminError('SYNAPSE BREACH: Credentials unauthorized. Code: ERR_AUTH_FAIL');
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-[#131315]/95 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md"
      >
        {/* Top Header Bar */}
        <div className="bg-[#201f21] p-4 flex justify-between items-center border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#deed00] animate-pulse" />
            <span className="font-mono text-xs text-white uppercase tracking-wider font-bold">
              PORTAL_COGNITIVE_SYNC.EXE
            </span>
          </div>

          <button
            onClick={() => {
              playSound(400, 'sine', 0.05);
              onBackToLanding();
            }}
            className="text-gray-500 hover:text-white font-mono text-xs uppercase"
          >
            [BACK]
          </button>
        </div>

        {/* Tab Role selection buttons */}
        <div className="grid grid-cols-2 border-b border-gray-800">
          <button
            onClick={() => {
              playSound(500, 'sine', 0.05);
              setRoleTab('siswa');
              setIsRegistering(false);
            }}
            className={`py-4 font-mono text-xs uppercase tracking-widest text-center transition-all ${
              roleTab === 'siswa'
                ? 'bg-[#18181a] text-[#deed00] border-b-2 border-[#deed00] font-bold'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Siswa Portal (Student)
          </button>
          <button
            onClick={() => {
              playSound(500, 'sine', 0.05);
              setRoleTab('admin');
            }}
            className={`py-4 font-mono text-xs uppercase tracking-widest text-center transition-all ${
              roleTab === 'admin'
                ? 'bg-[#18181a] text-[#00f0ff] border-b-2 border-[#00f0ff] font-bold'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Admin Portal (Authority)
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {roleTab === 'siswa' ? (
              /* Siswa (Student) Portal Content */
              <motion.div
                key="siswa-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                {!isRegistering ? (
                  /* Standard Student Login Mode */
                  <form onSubmit={handleStudentSubmit} className="space-y-6">
                    <div>
                      <h3 className="font-sans text-base font-bold text-white mb-2 uppercase tracking-wide">
                        Select Neural Identity (Demo)
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {demoStudents.map((stud, idx) => (
                          <button
                            key={stud.name}
                            type="button"
                            onClick={() => handleDemoSelect(idx)}
                            className={`p-4 rounded-xl border text-left transition-all flex items-center gap-3 ${
                              selectedDemoIndex === idx
                                ? 'border-[#deed00] bg-[#deed00]/5 text-white'
                                : 'border-gray-800 text-gray-400 hover:border-gray-700'
                            }`}
                          >
                            <img src={stud.avatar} className="w-10 h-10 rounded-full object-cover grayscale" alt={stud.name} />
                            <div>
                              <div className="font-sans text-xs font-bold text-white uppercase">{stud.name}</div>
                              <div className="font-mono text-[9px] text-gray-500 uppercase flex items-center gap-1">
                                <GuildIcon guildName={stud.guild} className="w-3 h-3 flex-shrink-0" />
                                {stud.guild}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-gray-800"></div>
                      <span className="flex-shrink mx-4 text-gray-600 font-mono text-[10px] uppercase tracking-widest">Or enter custom identity</span>
                      <div className="flex-grow border-t border-gray-800"></div>
                    </div>

                    {/* Custom student ID input */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Custom Agent Alias</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                        <input
                          type="text"
                          value={customStudentName}
                          onChange={(e) => {
                            setCustomStudentName(e.target.value);
                            setSelectedDemoIndex(-1);
                          }}
                          placeholder="e.g. Siti Matrix"
                          className="w-full bg-black/60 border border-gray-800 focus:border-[#deed00] text-white px-10 py-3 rounded-lg text-sm font-sans focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={selectedDemoIndex === -1 && !customStudentName.trim()}
                        className="w-full py-4 bg-[#deed00] hover:bg-[#deed00]/90 text-black font-mono text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Launch Student HUD
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          playSound(700, 'sine', 0.08);
                          setIsRegistering(true);
                        }}
                        className="text-center font-mono text-[11px] text-[#00f0ff] hover:underline"
                      >
                        [CREATE NEW STUDENT IDENTITY PROTOCOL]
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Custom Registration Form Mode */
                  <form onSubmit={handleStudentSubmit} className="space-y-5">
                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                      <h3 className="font-sans text-base font-black text-[#deed00] uppercase tracking-wide">
                        Registration Protocol
                      </h3>
                      <button
                        type="button"
                        onClick={() => {
                          playSound(400, 'sine', 0.05);
                          setIsRegistering(false);
                        }}
                        className="font-mono text-[10px] text-gray-500 hover:text-white"
                      >
                        [CANCEL]
                      </button>
                    </div>

                    {/* Agent Alias Name */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Agent Alias Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="Type alias code name..."
                          className="w-full bg-black/60 border border-gray-800 focus:border-[#00f0ff] text-white px-10 py-3 rounded-lg text-sm font-sans focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Avatar Select */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Faceprint Implant</label>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {MOCK_AVATARS.map((av, index) => (
                          <button
                            key={av}
                            type="button"
                            onClick={() => {
                              playSound(700 + index * 40, 'sine', 0.05);
                              setRegAvatar(av);
                            }}
                            className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                              regAvatar === av ? 'border-[#00f0ff] scale-105' : 'border-gray-800 opacity-60'
                            }`}
                          >
                            <img src={av} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Guild Assignment */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Guild Alignment</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {AVAILABLE_GUILDS.map((guild) => {
                          const isSelected = regGuild === guild;
                          return (
                            <button
                              key={guild}
                              type="button"
                              onClick={() => {
                                playSound(500, 'sine', 0.05);
                                setRegGuild(guild);
                              }}
                              className={`p-3 rounded-lg border text-left transition-all ${
                                isSelected
                                  ? 'border-[#00f0ff] bg-[#00f0ff]/5 text-white'
                                  : 'border-gray-800 text-gray-400 hover:border-gray-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <GuildIcon guildName={guild} className="w-4 h-4 flex-shrink-0" />
                                <span className="font-sans text-[11px] font-bold">{guild}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all"
                    >
                      Incorporate Implants & Sync HUD
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </motion.div>
            ) : (
              /* Admin Authority Login Content */
              <motion.div
                key="admin-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <div className="bg-black/40 border border-gray-800 p-4 rounded-xl space-y-2 font-mono text-xs text-gray-400">
                  <div className="text-gray-500 uppercase text-[9px] tracking-wider font-bold">
                    AUTHORITY LOGIN INSTRUCTIONS
                  </div>
                  <p>
                    Portal khusus untuk panitia / admin MPLS. Isikan kode pengenal keamanan sistem untuk sinkronisasi konsol utama.
                  </p>
                  <p className="text-[#00f0ff]">
                    Demo credentials: Username: <span className="font-bold">admin</span>, Passcode: <span className="font-bold">cyber2026</span>
                  </p>
                </div>

                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Admin Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        required
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        placeholder="Type admin username..."
                        className="w-full bg-black/60 border border-gray-800 focus:border-[#00f0ff] text-white px-10 py-2.5 rounded-lg text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider">Access Passcode</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="password"
                        required
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Type passcode..."
                        className="w-full bg-black/60 border border-gray-800 focus:border-[#00f0ff] text-white px-10 py-2.5 rounded-lg text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  {adminError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-[11px] rounded">
                      {adminError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  >
                    Authenticate Secure Unit
                    <Cpu className="w-4 h-4" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
