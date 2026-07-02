/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu, Terminal, Compass, Users, HelpCircle, Shield, Award, LogIn,
  ChevronRight, CheckCircle, RefreshCcw, Radio, Bell, LogOut, ArrowRight,
  Database
} from 'lucide-react';

import ShaderBackground from './components/ShaderBackground';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './components/AdminDashboard';
import CampusTour from './components/CampusTour';
import ScannerPanel from './components/ScannerPanel';
import AgentStatus from './components/AgentStatus';
import QuestLog from './components/QuestLog';
import LeaderboardPanel from './components/LeaderboardPanel';
import InventoryPanel from './components/InventoryPanel';
import HelpDeskPanel from './components/HelpDeskPanel';
import DataUplinkPanel from './components/DataUplinkPanel.tsx';
import IDCard from './components/IDCard';

import { Agent, Quest, Announcement, AVAILABLE_GUILDS, MOCK_AVATARS, ActivityPhoto, INITIAL_ACTIVITIES } from './types';
import { 
  subscribeActivities, 
  saveActivityToFirestore, 
  deleteActivityFromFirestore,
  subscribeAnnouncements,
  saveAnnouncementToFirestore,
  deleteAnnouncementFromFirestore,
  subscribeAgents,
  saveAgentToFirestore,
  subscribeQuests,
  saveQuestToFirestore,
  deleteQuestFromFirestore
} from './lib/firebase';


const INITIAL_QUESTS: Quest[] = [
  {
    id: 'TOUR-01',
    name: 'Apel Pagi (Morning Assembly)',
    time: '07:15 - 08:00 WIB',
    code: 'APEL-07',
    reward: 50,
    status: 'Locked',
    description: 'Establish system connection at the central courtyard of Plaza Alpha-9. Verify morning assembly codes to synchronize daily schedule parameters.'
  },
  {
    id: 'TOUR-02',
    name: 'Tour Lab (Robotics Lab Exploration)',
    time: '09:00 - 11:30 WIB',
    code: 'TOUR-09',
    reward: 100,
    status: 'Locked',
    description: 'Explore the high-voltage robotic cells of Lab Room 303. Observe prosthetic fabrication and complete terminal synchronization.'
  },
  {
    id: 'TOUR-03',
    name: 'Seminar (Futuristic Tech Talk)',
    time: '13:00 - 15:00 WIB',
    code: 'SEMINAR-14',
    reward: 150,
    status: 'Locked',
    description: 'Dock inside the Holographic Lecture Hall at Auditorium Omega. Absorb lecture data and authenticate session key.'
  },
  {
    id: 'TOUR-04',
    name: 'AI Workshop (Optional Quest)',
    time: '15:30 - 17:00 WIB',
    code: 'AI-2026',
    reward: 200,
    status: 'Locked',
    description: 'Audit persistent synthetic models inside Server Block B-12. Learn direct interface command codes for synthetic tutors.'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'A-1',
    title: 'SINKRONISASI NEURAL PORTAL AKTIF',
    content: 'Selamat datang di MPLS Cyber Academy 2026. Semua murid diwajibkan mengintegrasi implan kognitif faksi masing-masing pada terminal siswa untuk membuka quest harian.',
    timestamp: '08:00 WIB',
    severity: 'INFO'
  },
  {
    id: 'A-2',
    title: 'PENGUMUMAN SEKTOR LAB ROBOTIK',
    content: 'Akses ke Sektor Lab 303 kini dibuka! Cari pemindai AR tersembunyi di sekitar ruangan untuk menyingkronkan poin penemuan khusus.',
    timestamp: '10:15 WIB',
    severity: 'ALERT'
  }
];

export default function App() {
  // Navigation / Page routing state: 'landing' | 'login' | 'hud' | 'admin' | 'tour'
  const [page, setPage] = useState<'landing' | 'login' | 'hud' | 'admin' | 'tour'>(() => {
    const savedUser = localStorage.getItem('mpls_current_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.role === 'admin') return 'admin';
        if (parsed.name) return 'hud';
      } catch (e) {}
    }
    return 'landing';
  });

  // Current logged in user/agent state
  const [currentUser, setCurrentUser] = useState<Agent | null>(() => {
    const saved = localStorage.getItem('mpls_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // Complete directory of simulated student agents
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('mpls_agents_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        name: 'Arjuna Wibowo',
        guild: 'Group 02 - CYBER FOX',
        level: 1,
        exp: 0,
        avatar: MOCK_AVATARS[0],
        status: 'NEURAL SYNCED',
        role: 'siswa'
      },
      {
        name: 'Budi Jaringan',
        guild: 'Group 03 - SHADOW GRID',
        level: 2,
        exp: 150,
        avatar: MOCK_AVATARS[2],
        status: 'NEURAL SYNCED',
        role: 'siswa'
      }
    ];
  });

  // Quests list state
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('mpls_quests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_QUESTS;
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('mpls_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Activities state
  const [activities, setActivities] = useState<ActivityPhoto[]>(() => {
    const saved = localStorage.getItem('mpls_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_ACTIVITIES;
  });

  const [hudTab, setHudTab] = useState<'missions' | 'leaderboard' | 'inventory' | 'help' | 'uplink' | 'idcard'>('missions');
  const [lastCheckIn, setLastCheckIn] = useState<string>(() => {
    return localStorage.getItem('mpls_last_checkin') || '';
  });

  const [levelUpAlert, setLevelUpAlert] = useState<{ show: boolean; level: number }>({
    show: false,
    level: 1
  });

  // Persistance Effects
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mpls_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mpls_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mpls_agents_list', JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem('mpls_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('mpls_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('mpls_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    if (lastCheckIn) {
      localStorage.setItem('mpls_last_checkin', lastCheckIn);
    } else {
      localStorage.removeItem('mpls_last_checkin');
    }
  }, [lastCheckIn]);

  // Real-time Database Subscriptions
  useEffect(() => {
    const unsubscribe = subscribeActivities((list) => {
      if (list.length > 0) {
        setActivities(list);
      } else {
        // Seed if Firestore is completely empty (first run)
        INITIAL_ACTIVITIES.forEach((act) => {
          saveActivityToFirestore(act);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeAnnouncements((list) => {
      if (list.length > 0) {
        setAnnouncements(list);
      } else {
        // Seed if Firestore is completely empty (first run)
        INITIAL_ANNOUNCEMENTS.forEach((ann) => {
          saveAnnouncementToFirestore(ann);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeAgents((list) => {
      if (list.length > 0) {
        setAgents(list);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeQuests((list) => {
      if (list.length > 0) {
        setQuests(list);
      } else {
        // Seed if Firestore is completely empty (first run)
        INITIAL_QUESTS.forEach((q) => {
          saveQuestToFirestore(q);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Keep currentUser state in sync with real-time updates from the agents collection
  useEffect(() => {
    if (currentUser && currentUser.role === 'siswa') {
      const liveAgent = agents.find((a) => a.name.toLowerCase() === currentUser.name.toLowerCase());
      if (liveAgent) {
        if (
          liveAgent.level !== currentUser.level ||
          liveAgent.exp !== currentUser.exp ||
          liveAgent.status !== currentUser.status ||
          liveAgent.fullName !== currentUser.fullName ||
          liveAgent.nis !== currentUser.nis ||
          liveAgent.jurusan !== currentUser.jurusan ||
          JSON.stringify(liveAgent.completedQuests) !== JSON.stringify(currentUser.completedQuests)
        ) {
          setCurrentUser(liveAgent);
        }
      }
    }
  }, [agents, currentUser?.name]);


  // Audio syntheizer chime
  const playSound = (freq = 800, duration = 0.1) => {
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

  // Login event handlers
  const handleLoginSiswa = async (siswaAgent: Agent) => {
    // Check if agent already exists in list, otherwise append
    const exists = agents.some((a) => a.name.toLowerCase() === siswaAgent.name.toLowerCase());
    let finalAgent = siswaAgent;
    if (!exists) {
      setAgents((prev) => [...prev, siswaAgent]);
    } else {
      // Load current level and exp of existing agent from directory list
      const matched = agents.find((a) => a.name.toLowerCase() === siswaAgent.name.toLowerCase());
      if (matched) {
        finalAgent = matched;
      }
    }

    setCurrentUser(finalAgent);
    setPage('hud');
    await saveAgentToFirestore(finalAgent);
  };

  const handleLoginAdmin = () => {
    const adminUser: Agent = {
      name: 'OVERLORD AUTHORITY',
      guild: 'PANITIA STAFF',
      level: 99,
      exp: 9999,
      avatar: MOCK_AVATARS[3],
      status: 'SYSTEM OVERLORD',
      role: 'admin'
    };
    setCurrentUser(adminUser);
    setPage('admin');
  };

  const handleLogout = () => {
    playSound(400, 0.15);
    setCurrentUser(null);
    setPage('landing');
  };

  // Student specific data update (saving back to main array)
  const handleUpdateStudentData = async (updatedPartial: Partial<Agent>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedPartial };
    setCurrentUser(updated);

    setAgents((prev) =>
      prev.map((a) => (a.name.toLowerCase() === currentUser.name.toLowerCase() ? { ...a, ...updatedPartial } : a))
    );
    await saveAgentToFirestore(updated);
  };

  // Synchronize student's completed quests when either quests or currentUser updates
  const syncedQuests: Quest[] = quests.map((q) => {
    if (currentUser && currentUser.completedQuests?.includes(q.id)) {
      return {
        ...q,
        status: 'Success' as const,
        scannedAt: q.scannedAt || 'Synced'
      };
    }
    return {
      ...q,
      status: q.status === 'Success' ? 'Locked' as const : q.status,
      scannedAt: undefined
    };
  });

  // Scan Code Processor
  const handleScanSuccess = (code: string): any => {
    const matchedIdx = quests.findIndex((q) => q.code.toUpperCase() === code.toUpperCase());
    if (matchedIdx === -1) {
      playSound(300, 0.25);
      return { success: false };
    }

    const matchedQuest = quests[matchedIdx];
    // Check if already completed in student profile
    const alreadyCompleted = currentUser?.completedQuests?.includes(matchedQuest.id);
    if (alreadyCompleted) {
      return { success: false };
    }

    // Update EXP and level up checks
    if (currentUser) {
      const prevLevel = currentUser.level;
      let newExp = currentUser.exp + matchedQuest.reward;
      let newLevel = prevLevel;

      // Level Up rules
      if (newExp >= 100) {
        newLevel += Math.floor(newExp / 100);
        newExp = newExp % 100;
      }

      const updatedCompleted = Array.from(new Set([...(currentUser.completedQuests || []), matchedQuest.id]));

      const updatedUser: Agent = {
        ...currentUser,
        exp: newExp,
        level: newLevel,
        status: 'NEURAL SYNCED',
        completedQuests: updatedCompleted
      };

      setCurrentUser(updatedUser);
      setAgents((prev) =>
        prev.map((a) => (a.name.toLowerCase() === currentUser.name.toLowerCase() ? updatedUser : a))
      );
      saveAgentToFirestore(updatedUser);

      // Trigger level-up alert sound
      if (newLevel > prevLevel) {
        playSound(1200, 0.4);
        setLevelUpAlert({ show: true, level: newLevel });
      } else {
        playSound(950, 0.15);
      }

      const checkInString = `${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB - ${matchedQuest.name.split(' (')[0]}`;
      setLastCheckIn(checkInString);
    }

    return {
      success: true,
      questName: matchedQuest.name.split(' (')[0],
      reward: matchedQuest.reward
    };
  };

  const handleResetHUD = () => {
    const confirm = window.confirm('Are you sure you want to format neural codes? All levels, quests, and gear unlocks will be permanently lost.');
    if (!confirm) return;

    if (currentUser) {
      setAgents((prev) => prev.filter((a) => a.name.toLowerCase() !== currentUser.name.toLowerCase()));
    }
    handleLogout();
  };

  return (
    <div className="bg-[#131315] text-[#e5e1e4] font-sans min-h-screen flex flex-col relative overflow-x-hidden select-none">
      {/* Shader Background Backdrop */}
      <ShaderBackground />

      {/* Level Up Flash overlay */}
      <AnimatePresence>
        {levelUpAlert.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-24 h-24 bg-[#deed00] rounded-full flex items-center justify-center text-black shadow-[0_0_50px_rgba(222,237,0,0.5)] mb-6"
            >
              <Award className="w-12 h-12" />
            </motion.div>
            <h1 className="font-display text-4xl font-extrabold text-[#deed00] uppercase tracking-widest mb-2">
              NEURAL SYNC UPGRADED!
            </h1>
            <h2 className="font-sans text-xl font-bold text-white uppercase tracking-wider">
              AGENT LEVEL {levelUpAlert.level} REACHED
            </h2>
            <p className="text-gray-400 font-mono text-xs max-w-sm mt-3 leading-relaxed">
              New tactical decryption parameters integrated. Check your Inventory for unlocked military gear!
            </p>
            <button
              onClick={() => setLevelUpAlert({ show: false, level: 1 })}
              className="mt-8 px-6 py-2.5 bg-white text-black font-mono text-xs uppercase font-bold rounded hover:bg-gray-100"
            >
              Acknowledge Upgrades
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header navigation */}
      <header className="bg-[#131315]/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-800/80">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div
              onClick={() => {
                playSound(600, 0.05);
                setPage('landing');
              }}
              className="font-display text-xl md:text-2xl font-black text-white tracking-tighter cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-[#deed00] font-mono">■</span>
              MPLS 2026
            </div>

            <div
              className="flex items-center gap-1.5 px-2 py-0.5 md:py-1 bg-[#1c2e1b] border border-[#2ae500]/30 rounded-full text-[#2ae500] select-none"
              title="Firebase Firestore: Real-time DB sync active across all devices"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ae500] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#2ae500]"></span>
              </span>
              <span className="font-mono text-[8px] md:text-[9px] font-bold tracking-wider uppercase">LIVE SYNCED</span>
            </div>
          </div>

          {/* Navigation link tags, only shown when registered and inside student HUD */}
          {page === 'hud' && currentUser?.role === 'siswa' && (
            <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-gray-400">
              <button
                onClick={() => setPage('tour')}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-[#deed00]" />
                Map Tour
              </button>
              <button
                onClick={() => setHudTab('missions')}
                className={`pb-1 border-b-2 transition-all ${
                  hudTab === 'missions' ? 'text-white border-[#deed00]' : 'border-transparent hover:text-white'
                }`}
              >
                Missions
              </button>
              <button
                onClick={() => setHudTab('leaderboard')}
                className={`pb-1 border-b-2 transition-all ${
                  hudTab === 'leaderboard' ? 'text-white border-[#deed00]' : 'border-transparent hover:text-white'
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setHudTab('inventory')}
                className={`pb-1 border-b-2 transition-all ${
                  hudTab === 'inventory' ? 'text-white border-[#deed00]' : 'border-transparent hover:text-white'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setHudTab('help')}
                className={`pb-1 border-b-2 transition-all ${
                  hudTab === 'help' ? 'text-white border-[#deed00]' : 'border-transparent hover:text-white'
                }`}
              >
                Help Desk
              </button>
              <button
                onClick={() => setHudTab('idcard')}
                className={`pb-1 border-b-2 transition-all ${
                  hudTab === 'idcard' ? 'text-white border-[#deed00]' : 'border-transparent hover:text-white'
                }`}
              >
                ID Card
              </button>
              <button
                onClick={() => setHudTab('uplink')}
                className={`pb-1 border-b-2 transition-all flex items-center gap-1 ${
                  hudTab === 'uplink' ? 'text-white border-[#deed00]' : 'border-transparent hover:text-white'
                }`}
              >
                <Database className="w-3 h-3 text-[#deed00]" />
                Data Uplink
              </button>
            </nav>
          )}

          {/* User Controls and Logout button */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline font-mono text-[10px] text-gray-500 uppercase">
                  ACTIVE: <span className="text-[#00f0ff] font-bold">{currentUser.name.split(' ')[0]}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white font-mono text-[9px] uppercase rounded transition-all"
                  title="Logout current user"
                >
                  <LogOut className="w-3 h-3 text-red-500" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  playSound(800, 0.05);
                  setPage('login');
                }}
                className="bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black px-4 py-2 font-mono text-[10px] font-black uppercase tracking-wider rounded transition-all flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                Auth Sync
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {page === 'landing' && (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage onEnterPortal={() => setPage('login')} activities={activities} />
            </motion.div>
          )}

          {page === 'login' && (
            <motion.div
              key="login-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <LoginPage
                onLoginSiswa={handleLoginSiswa}
                onLoginAdmin={handleLoginAdmin}
                onBackToLanding={() => setPage('landing')}
              />
            </motion.div>
          )}

          {page === 'admin' && currentUser?.role === 'admin' && (
            <motion.div
              key="admin-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard
                agents={agents}
                quests={quests}
                announcements={announcements}
                activities={activities}
                onAddQuest={async (q) => {
                  setQuests((prev) => [...prev, q]);
                  await saveQuestToFirestore(q);
                }}
                onEditQuest={async (q) => {
                  setQuests((prev) => prev.map((item) => (item.id === q.id ? q : item)));
                  await saveQuestToFirestore(q);
                }}
                onDeleteQuest={async (id) => {
                  setQuests((prev) => prev.filter((item) => item.id !== id));
                  await deleteQuestFromFirestore(id);
                }}
                onAddAgent={async (a) => {
                  setAgents((prev) => [...prev, a]);
                  await saveAgentToFirestore(a);
                }}
                onUpdateAgent={async (a) => {
                  setAgents((prev) => prev.map((item) => (item.name.toLowerCase() === a.name.toLowerCase() ? a : item)));
                  await saveAgentToFirestore(a);
                }}
                onDeleteAgent={(name) => setAgents((prev) => prev.filter((item) => item.name !== name))}
                onAddAnnouncement={async (ann) => {
                  setAnnouncements((prev) => [ann, ...prev]);
                  await saveAnnouncementToFirestore(ann);
                }}
                onDeleteAnnouncement={async (id) => {
                  setAnnouncements((prev) => prev.filter((item) => item.id !== id));
                  await deleteAnnouncementFromFirestore(id);
                }}
                onAddActivity={async (act) => {
                  setActivities((prev) => [act, ...prev]);
                  await saveActivityToFirestore(act);
                }}
                onDeleteActivity={async (id) => {
                  setActivities((prev) => prev.filter((item) => item.id !== id));
                  await deleteActivityFromFirestore(id);
                }}
                onUpdateActivity={async (act) => {
                  setActivities((prev) => prev.map((item) => (item.id === act.id ? act : item)));
                  await saveActivityToFirestore(act);
                }}
                onLogout={handleLogout}
                currentUser={currentUser}
                onUpdateCurrentUser={setCurrentUser}
              />
            </motion.div>
          )}

          {page === 'tour' && (
            <motion.div
              key="tour-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <CampusTour
                onBack={() => setPage(currentUser ? 'hud' : 'landing')}
                onEnterHUD={() => setPage('hud')}
              />
            </motion.div>
          )}

          {page === 'hud' && currentUser && (
            <motion.div
              key="hud-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl mx-auto px-6 py-8"
            >
              {/* Broadcast Alert Center widget in student HUD */}
              {announcements.length > 0 && (
                <div className="mb-6 space-y-2">
                  {announcements.slice(0, 1).map((ann) => (
                    <motion.div
                      initial={{ scale: 0.98, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={ann.id}
                      className={`p-4 rounded-xl border flex items-start gap-3 relative overflow-hidden backdrop-blur-md ${
                        ann.severity === 'ALERT'
                          ? 'bg-red-950/20 border-red-500/30 text-red-200'
                          : ann.severity === 'WARNING'
                          ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                          : 'bg-blue-950/25 border-blue-500/30 text-blue-200'
                      }`}
                    >
                      <Bell className={`w-5 h-5 flex-shrink-0 mt-0.5 ${ann.severity === 'ALERT' ? 'text-red-400 animate-bounce' : 'text-[#00f0ff]'}`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] uppercase tracking-widest font-black text-gray-400">
                            LIVE ADMIN BROADCAST
                          </span>
                          <span className="font-mono text-[9px] text-gray-500">{ann.timestamp}</span>
                        </div>
                        <h4 className="font-sans font-bold text-sm uppercase text-white">{ann.title}</h4>
                        <p className="font-sans text-xs text-gray-400 leading-relaxed">{ann.content}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Mobile Sub-Navigation Header */}
              <div className="md:hidden flex overflow-x-auto gap-4 pb-4 border-b border-gray-800 mb-6 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                <button
                  onClick={() => setPage('tour')}
                  className="bg-gray-800/40 border border-gray-700/60 px-3 py-1.5 rounded flex-shrink-0"
                >
                  🗺️ Map Tour
                </button>
                <button
                  onClick={() => setHudTab('missions')}
                  className={`px-3 py-1.5 rounded flex-shrink-0 ${
                    hudTab === 'missions' ? 'bg-[#deed00] text-black font-bold' : 'bg-gray-800/40'
                  }`}
                >
                  Missions
                </button>
                <button
                  onClick={() => setHudTab('leaderboard')}
                  className={`px-3 py-1.5 rounded flex-shrink-0 ${
                    hudTab === 'leaderboard' ? 'bg-[#deed00] text-black font-bold' : 'bg-gray-800/40'
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={() => setHudTab('inventory')}
                  className={`px-3 py-1.5 rounded flex-shrink-0 ${
                    hudTab === 'inventory' ? 'bg-[#deed00] text-black font-bold' : 'bg-gray-800/40'
                  }`}
                >
                  Inventory
                </button>
                 <button
                  onClick={() => setHudTab('help')}
                  className={`px-3 py-1.5 rounded flex-shrink-0 ${
                    hudTab === 'help' ? 'bg-[#deed00] text-black font-bold' : 'bg-gray-800/40'
                  }`}
                >
                  Help Desk
                </button>
                <button
                  onClick={() => setHudTab('idcard')}
                  className={`px-3 py-1.5 rounded flex-shrink-0 ${
                    hudTab === 'idcard' ? 'bg-[#deed00] text-black font-bold' : 'bg-gray-800/40'
                  }`}
                >
                  ID Card
                </button>
                <button
                  onClick={() => setHudTab('uplink')}
                  className={`px-3 py-1.5 rounded flex-shrink-0 flex items-center gap-1 ${
                    hudTab === 'uplink' ? 'bg-[#deed00] text-black font-bold' : 'bg-gray-800/40'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  Uplink
                </button>
              </div>

              {/* Sub-Tab Views */}
              {hudTab === 'missions' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left panel: Live Decryptor Scanner */}
                  <div className="lg:col-span-7">
                    <ScannerPanel onScanSuccess={handleScanSuccess} />
                  </div>

                  {/* Right panel: Profile status */}
                  <div className="lg:col-span-5">
                    <AgentStatus
                      agent={currentUser}
                      lastCheckIn={lastCheckIn}
                      onUpdateAgent={handleUpdateStudentData}
                      onReset={handleResetHUD}
                    />
                  </div>

                  {/* Bottom: Quest Log */}
                  <div className="lg:col-span-12">
                    <QuestLog quests={syncedQuests} />
                  </div>
                </div>
              )}

              {hudTab === 'leaderboard' && <LeaderboardPanel userAgent={currentUser} />}

              {hudTab === 'inventory' && <InventoryPanel userAgent={currentUser} quests={syncedQuests} />}

              {hudTab === 'help' && <HelpDeskPanel />}

              {hudTab === 'idcard' && (
                <IDCard agent={currentUser} />
              )}

              {hudTab === 'uplink' && (
                <DataUplinkPanel 
                  currentUser={currentUser}
                  quests={syncedQuests}
                  agents={agents}
                  onLoginSiswa={handleLoginSiswa}
                  onUpdateQuests={setQuests}
                  onUpdateAgents={setAgents}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Cyber Footer Bar */}
      <footer className="bg-[#0e0e10] border-t border-gray-800/80 mt-auto py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="font-mono text-[10px] text-gray-500 tracking-wider">
            © 2026 MPLS COMMAND. SYSTEM STATUS: <span className="text-[#2ae500] font-bold">NOMINAL</span>. SERVER_TIME: 14:22:01 UTC
          </div>
          <div className="flex gap-6 font-mono text-[10px] uppercase tracking-wider text-gray-500">
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Protocol
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Tech Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
