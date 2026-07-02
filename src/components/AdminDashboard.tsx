/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal, Shield, Users, Radio, Award, Trash2, Edit2, Plus, RefreshCw, Check,
  AlertTriangle, Play, HelpCircle, UserPlus, LogOut, Info, Star, Save, Download, Upload,
  FolderArchive, Calendar, Tag, Lock, X, Eye, Image as ImageIcon
} from 'lucide-react';
import { Quest, Agent, Announcement, AVAILABLE_GUILDS, MOCK_AVATARS, SCIFI_AVATARS, ActivityPhoto } from '../types';
import GuildIcon from './GuildIcon';
import IDCard from './IDCard';

interface AdminDashboardProps {
  agents: Agent[];
  quests: Quest[];
  announcements: Announcement[];
  activities: ActivityPhoto[];
  onAddQuest: (quest: Quest) => void;
  onEditQuest: (quest: Quest) => void;
  onDeleteQuest: (id: string) => void;
  onAddAgent: (agent: Agent) => void;
  onUpdateAgent: (agent: Agent) => void;
  onDeleteAgent: (name: string) => void;
  onAddAnnouncement: (announcement: Announcement) => void;
  onDeleteAnnouncement: (id: string) => void;
  onAddActivity: (activity: ActivityPhoto) => void;
  onDeleteActivity: (id: string) => void;
  onUpdateActivity: (activity: ActivityPhoto) => void;
  onLogout: () => void;
  currentUser: Agent | null;
  onUpdateCurrentUser: (updated: Agent) => void;
}

export default function AdminDashboard({
  agents,
  quests,
  announcements,
  activities = [],
  onAddQuest,
  onEditQuest,
  onDeleteQuest,
  onAddAgent,
  onUpdateAgent,
  onDeleteAgent,
  onAddAnnouncement,
  onDeleteAnnouncement,
  onAddActivity,
  onDeleteActivity,
  onUpdateActivity,
  onLogout,
  currentUser,
  onUpdateCurrentUser
}: AdminDashboardProps) {
  // Tabs: 'analytics', 'quests', 'agents', 'announcements', 'profile_id', 'archive'
  const [activeTab, setActiveTab] = useState<'analytics' | 'quests' | 'agents' | 'announcements' | 'profile_id' | 'archive'>('analytics');

  // Add/Edit Quest Forms
  const [isAddingQuest, setIsAddingQuest] = useState(false);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);

  const [questId, setQuestId] = useState('');
  const [questName, setQuestName] = useState('');
  const [questTime, setQuestTime] = useState('08:00 - 15:00 WIB');
  const [questCode, setQuestCode] = useState('');
  const [questReward, setQuestReward] = useState(100);
  const [questDesc, setQuestDesc] = useState('');

  // Add Agent Form
  const [isAddingAgent, setIsAddingAgent] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentFullName, setAgentFullName] = useState('');
  const [agentNis, setAgentNis] = useState('');
  const [agentJurusan, setAgentJurusan] = useState('RPL');
  const [agentGuild, setAgentGuild] = useState(AVAILABLE_GUILDS[0]);
  const [agentAvatar, setAgentAvatar] = useState(MOCK_AVATARS[0]);

  // Announcement Form
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');
  const [announceSeverity, setAnnounceSeverity] = useState<'INFO' | 'WARNING' | 'ALERT'>('INFO');

  // Admin Profile Edit States
  const [adminFullName, setAdminFullName] = useState(currentUser?.fullName || 'PANITIA STAFF OVERLORD');
  const [adminName, setAdminName] = useState(currentUser?.name || 'OVERLORD AUTHORITY');
  const [adminNis, setAdminNis] = useState(currentUser?.nis || 'PANITIA-9922');
  const [adminJurusan, setAdminJurusan] = useState(currentUser?.jurusan || 'STAFF SYSTEM');
  const [adminGuild, setAdminGuild] = useState(currentUser?.guild || 'PANITIA STAFF');
  const [adminAvatar, setAdminAvatar] = useState(currentUser?.avatar || SCIFI_AVATARS[0]);
  const [adminStatus, setAdminStatus] = useState(currentUser?.status || 'SYSTEM OVERLORD');

  const handleAdminFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAdminAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAdminProfile = () => {
    if (!adminName.trim()) return;
    const updatedAdmin: Agent = {
      name: adminName,
      fullName: adminFullName,
      nis: adminNis,
      jurusan: adminJurusan,
      guild: adminGuild,
      avatar: adminAvatar,
      status: adminStatus,
      level: 99,
      exp: 9999,
      role: 'admin'
    };
    onUpdateCurrentUser(updatedAdmin);
    playClick(1100);
  };

  // Activity Archive form states & handlers
  const [editingActivityId, setEditingActivityId] = useState<string | null>(null);
  const [deletingActivityId, setDeletingActivityId] = useState<string | null>(null);
  const [actTitle, setActTitle] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [actTags, setActTags] = useState('DOKUMENTASI, MPLS, KEGIATAN');
  const [actCode, setActCode] = useState('');
  const [actImage, setActImage] = useState('');
  const [isDraggingAct, setIsDraggingAct] = useState(false);

  const handleActFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setActImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddActivitySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim() || !actDesc.trim() || !actImage) {
      playClick(300);
      return;
    }

    const tagsArray = actTags
      .split(',')
      .map((t) => t.trim().toUpperCase())
      .filter((t) => t.length > 0);

    const generatedCode = actCode.trim() 
      ? actCode.trim().toUpperCase()
      : `ARC-${Math.floor(1000 + Math.random() * 9000)}-ACT`;

    if (editingActivityId) {
      const existing = activities.find((a) => a.id === editingActivityId);
      const updatedActivity: ActivityPhoto = {
        id: editingActivityId,
        title: actTitle.trim(),
        description: actDesc.trim(),
        imageUrl: actImage,
        date: existing ? existing.date : new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        uploader: existing ? existing.uploader : (currentUser?.name || 'PANITIA STAFF'),
        tags: tagsArray,
        encryptionCode: generatedCode
      };
      onUpdateActivity(updatedActivity);
      playClick(1100);
      setEditingActivityId(null);
    } else {
      const newActivity: ActivityPhoto = {
        id: `ACT-${Date.now()}`,
        title: actTitle.trim(),
        description: actDesc.trim(),
        imageUrl: actImage,
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }),
        uploader: currentUser?.name || 'PANITIA STAFF',
        tags: tagsArray,
        encryptionCode: generatedCode
      };

      onAddActivity(newActivity);
      playClick(1050);
    }

    // Reset fields
    setActTitle('');
    setActDesc('');
    setActTags('DOKUMENTASI, MPLS, KEGIATAN');
    setActCode('');
    setActImage('');
  };

  // Sound Synth Helper
  const playClick = (freq = 900) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  // Quest Actions
  const handleSaveQuest = (e: FormEvent) => {
    e.preventDefault();
    if (!questId.trim() || !questName.trim() || !questCode.trim()) return;

    if (editingQuestId) {
      onEditQuest({
        id: editingQuestId,
        name: questName,
        time: questTime,
        code: questCode.trim().toUpperCase(),
        reward: Number(questReward),
        status: 'Locked',
        description: questDesc
      });
      setEditingQuestId(null);
    } else {
      onAddQuest({
        id: questId.trim().toUpperCase(),
        name: questName,
        time: questTime,
        code: questCode.trim().toUpperCase(),
        reward: Number(questReward),
        status: 'Locked',
        description: questDesc
      });
      setIsAddingQuest(false);
    }

    // Reset Form
    setQuestId('');
    setQuestName('');
    setQuestCode('');
    setQuestReward(100);
    setQuestDesc('');
    playClick(1100);
  };

  const startEditQuest = (q: Quest) => {
    setEditingQuestId(q.id);
    setQuestId(q.id);
    setQuestName(q.name);
    setQuestTime(q.time);
    setQuestCode(q.code);
    setQuestReward(q.reward);
    setQuestDesc(q.description);
    setIsAddingQuest(true);
    playClick(1000);
  };

  // Agent Actions
  const handleCreateAgent = (e: FormEvent) => {
    e.preventDefault();
    if (!agentName.trim() || !agentFullName.trim() || !agentNis.trim()) return;

    onAddAgent({
      name: agentName.trim(),
      fullName: agentFullName.trim(),
      nis: agentNis.trim(),
      jurusan: agentJurusan,
      guild: agentGuild,
      level: 1,
      exp: 0,
      avatar: agentAvatar,
      status: 'NEURAL SYNCED',
      role: 'siswa'
    });

    setAgentName('');
    setAgentFullName('');
    setAgentNis('');
    setAgentJurusan('RPL');
    setIsAddingAgent(false);
    playClick(1100);
  };

  const exportStudentsToExcel = () => {
    // Prepare headers
    const headers = ["No", "Nama Lengkap", "Alias / Code Name", "NIS", "Jurusan", "Guild Group", "Level", "EXP Points", "Status"];
    const rows = agents.map((a, i) => [
      i + 1,
      a.fullName || '-',
      a.name,
      a.nis || '-',
      a.jurusan || '-',
      a.guild,
      a.level,
      a.exp,
      a.status
    ]);

    // Create CSV content with semicolon separator for European/Indonesian locale compatibility in Excel
    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.map(val => {
        const str = String(val).replace(/"/g, '""');
        return str.includes(";") || str.includes("\n") || str.includes(",") ? `"${str}"` : str;
      }).join(";"))
    ].join("\n");

    // Force UTF-8 BOM so Excel opens it with correct Indonesian characters & encoding
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mpls_siswa_registry_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playClick(1000);
  };

  const exportQuestsToExcel = () => {
    const headers = ["No", "Quest ID", "Nama Misi (Quest Name)", "Scannable Code", "XP Reward", "Waktu Pelaksanaan", "Deskripsi"];
    const rows = quests.map((q, i) => [
      i + 1,
      q.id,
      q.name,
      q.code,
      q.reward,
      q.time,
      q.description
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map(row => row.map(val => {
        const str = String(val).replace(/"/g, '""');
        return str.includes(";") || str.includes("\n") || str.includes(",") ? `"${str}"` : str;
      }).join(";"))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mpls_quest_registry_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    playClick(1000);
  };

  const handleAdjustExp = (agent: Agent, amount: number) => {
    const updated = { ...agent };
    updated.exp += amount;

    // Standard Level Up logic: 100 EXP per level
    if (updated.exp >= 100) {
      updated.level += Math.floor(updated.exp / 100);
      updated.exp = updated.exp % 100;
      updated.status = 'NEURAL SYNCED';
    } else if (updated.exp < 0) {
      updated.exp = 0;
    }

    onUpdateAgent(updated);
    playClick(1200);
  };

  // Announcement Action
  const handlePostAnnouncement = (e: FormEvent) => {
    e.preventDefault();
    if (!announceTitle.trim() || !announceContent.trim()) return;

    const newAnnounce: Announcement = {
      id: Math.random().toString(36).substring(2, 9).toUpperCase(),
      title: announceTitle.trim(),
      content: announceContent.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      severity: announceSeverity
    };

    onAddAnnouncement(newAnnounce);
    setAnnounceTitle('');
    setAnnounceContent('');
    playClick(1300);
  };

  // Calculate high-fidelity stats for analytics view
  const totalAgents = agents.length;
  const totalQuests = quests.length;
  const totalExp = agents.reduce((sum, a) => sum + (a.level * 100) + a.exp, 0);
  const averageLevel = totalAgents > 0 ? (agents.reduce((sum, a) => sum + a.level, 0) / totalAgents).toFixed(1) : '1.0';

  // Guild power count helper
  const guildStats = AVAILABLE_GUILDS.reduce((acc, g) => {
    acc[g] = agents.filter(a => a.guild === g).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Admin Dashboard Controls Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse" />
            <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">SECURE ADMINISTRATIVE CONSOLE</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            PANITIA CORE CONTROL
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#1c1c1f] border border-gray-800 rounded-lg text-xs font-mono text-gray-400">
            SEC_LEVEL: <span className="text-[#00f0ff] font-bold">OVERLORD</span>
          </div>

          <button
            onClick={() => {
              playClick(400);
              onLogout();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/40 hover:bg-red-900/30 border border-red-500/30 text-red-400 font-mono text-xs uppercase rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            LOGOUT SYSTEM
          </button>
        </div>
      </div>

      {/* Admin Quick Stat Panels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#131315] border border-gray-800 p-5 rounded-xl space-y-1">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Registered Siswa</div>
          <div className="text-3xl font-black font-sans text-[#deed00]">{totalAgents}</div>
          <div className="text-[9px] font-mono text-gray-600">ACTIVE NEURAL SYNC</div>
        </div>

        <div className="bg-[#131315] border border-gray-800 p-5 rounded-xl space-y-1">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Available Quests</div>
          <div className="text-3xl font-black font-sans text-[#00f0ff]">{totalQuests}</div>
          <div className="text-[9px] font-mono text-gray-600">SCANNER VERIFIABLE</div>
        </div>

        <div className="bg-[#131315] border border-gray-800 p-5 rounded-xl space-y-1">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Exp Distributed</div>
          <div className="text-3xl font-black font-sans text-white">{totalExp}</div>
          <div className="text-[9px] font-mono text-gray-600">TOTAL ACQUIRED POWER</div>
        </div>

        <div className="bg-[#131315] border border-gray-800 p-5 rounded-xl space-y-1">
          <div className="text-[10px] font-mono text-gray-500 uppercase">Avg Agent Level</div>
          <div className="text-3xl font-black font-sans text-emerald-400">{averageLevel}</div>
          <div className="text-[9px] font-mono text-gray-600">AVERAGE DEVELOPMENT</div>
        </div>
      </div>

      {/* Sub Navigation */}
      <div className="flex border-b border-gray-800 overflow-x-auto gap-2">
        {(['analytics', 'quests', 'agents', 'announcements', 'profile_id', 'archive'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              playClick(700);
              setActiveTab(tab);
            }}
            className={`py-3 px-4 font-mono text-xs uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab
                ? 'border-[#00f0ff] text-white bg-black/30'
                : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
          >
            {tab === 'analytics' && 'System Analytics'}
            {tab === 'quests' && 'Quest Database'}
            {tab === 'agents' && 'Siswa Database'}
            {tab === 'announcements' && 'Broadcaster Node'}
            {tab === 'profile_id' && '🪪 My Profile & ID Card'}
            {tab === 'archive' && '📂 Activity Archive'}
          </button>
        ))}
      </div>

      {/* Content views */}
      <div className="bg-black/20 rounded-2xl min-h-[400px]">
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Guild distribution metrics */}
            <div className="lg:col-span-6 bg-[#131315] border border-gray-800 p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide">
                  Guild Power Matrix Distribution
                </h3>
                <p className="font-mono text-[11px] text-gray-500">Live share distribution per orientation group.</p>
              </div>

               <div className="space-y-4">
                {AVAILABLE_GUILDS.map((guild) => {
                  const count = guildStats[guild] || 0;
                  const percent = totalAgents > 0 ? (count / totalAgents) * 100 : 0;
                  return (
                    <div key={guild} className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-gray-300 font-bold uppercase flex items-center gap-1.5">
                          <GuildIcon guildName={guild} className="w-4 h-4 flex-shrink-0" />
                          {guild}
                        </span>
                        <span className="text-[#00f0ff]">{count} Siswa ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-gray-800">
                        <div
                          style={{ width: `${percent}%` }}
                          className="bg-gradient-to-r from-[#00f0ff] to-[#deed00] h-full rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Activity & Diagnostics logs */}
            <div className="lg:col-span-6 bg-[#131315] border border-gray-800 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide">
                  Orientation System Core Log
                </h3>
                <p className="font-mono text-[11px] text-gray-500">Diagnostic logging events from internal system ports.</p>
              </div>

              <div className="bg-black/60 border border-gray-800 rounded-xl p-4 font-mono text-xs space-y-3 max-h-[250px] overflow-y-auto">
                <div className="text-[#deed00] flex justify-between">
                  <span>[SYS_LOG] Core database synced.</span>
                  <span>TIME: OK</span>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>[SYS_LOG] Generated live map links for offline.</span>
                  <span>2026.07.02</span>
                </div>
                <div className="text-gray-400 flex justify-between">
                  <span>[SYS_LOG] Admin authenticated to control base.</span>
                  <span>SUCCESS</span>
                </div>
                <div className="text-emerald-400 flex justify-between">
                  <span>[SYS_LOG] Student Arjuna completed mission TOUR-01.</span>
                  <span>+100 EXP</span>
                </div>
                <div className="text-gray-500 flex justify-between text-[10px]">
                  <span>[SYS_LOG] Waiting for scanner connection hooks...</span>
                  <span>LISTEN</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'quests' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Action Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#131315] p-4 border border-gray-800 rounded-xl gap-4">
              <div>
                <span className="font-sans text-xs font-bold text-white uppercase block">Quest Database Controller</span>
                <span className="font-mono text-[10px] text-gray-500">Create, edit, or remove scanning codes.</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={exportQuestsToExcel}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Excel (Quests)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClick(800);
                    setEditingQuestId(null);
                    setQuestId('');
                    setQuestName('');
                    setQuestCode('');
                    setQuestReward(100);
                    setQuestDesc('');
                    setIsAddingQuest(!isAddingQuest);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#deed00] text-black font-mono text-[10px] uppercase font-black tracking-wider rounded transition-all"
                >
                  <Plus className="w-4 h-4" />
                  {isAddingQuest ? 'Close Form' : 'Add New Quest'}
                </button>
              </div>
            </div>

            {/* Expandable Quest Form */}
            <AnimatePresence>
              {isAddingQuest && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleSaveQuest} className="bg-[#131315] border border-gray-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-12 border-b border-gray-800 pb-2 mb-2">
                      <span className="font-mono text-[10px] text-[#00f0ff] uppercase tracking-wider font-bold">
                        {editingQuestId ? 'EDIT QUEST PROTOCOL' : 'REGISTER NEW QUEST MODULE'}
                      </span>
                    </div>

                    {/* Quest ID */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Quest ID Code</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingQuestId}
                        value={questId}
                        onChange={(e) => setQuestId(e.target.value)}
                        placeholder="e.g. QUEST-05"
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded uppercase font-mono focus:border-[#deed00] focus:outline-none disabled:opacity-50"
                      />
                    </div>

                    {/* Quest Name */}
                    <div className="md:col-span-6 space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Quest Title / Name</label>
                      <input
                        type="text"
                        required
                        value={questName}
                        onChange={(e) => setQuestName(e.target.value)}
                        placeholder="e.g. Scan Server Central Room"
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none"
                      />
                    </div>

                    {/* Reward XP */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">XP Reward</label>
                      <input
                        type="number"
                        required
                        value={questReward}
                        onChange={(e) => setQuestReward(Number(e.target.value))}
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded font-mono focus:border-[#deed00] focus:outline-none"
                      />
                    </div>

                    {/* Time frame */}
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Time Allotment</label>
                      <input
                        type="text"
                        required
                        value={questTime}
                        onChange={(e) => setQuestTime(e.target.value)}
                        placeholder="e.g. 08:00 - 15:00 WIB"
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded font-mono focus:border-[#deed00] focus:outline-none"
                      />
                    </div>

                    {/* Secret QR Code text */}
                    <div className="md:col-span-4 space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Secret Scannable Code String</label>
                      <input
                        type="text"
                        required
                        value={questCode}
                        onChange={(e) => setQuestCode(e.target.value)}
                        placeholder="e.g. LABCOGNITIVE2026"
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded font-mono uppercase focus:border-[#deed00] focus:outline-none"
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-12 space-y-1.5">
                      <label className="block text-[10px] font-mono text-gray-500 uppercase">Mission Description Instructions</label>
                      <textarea
                        required
                        rows={2}
                        value={questDesc}
                        onChange={(e) => setQuestDesc(e.target.value)}
                        placeholder="Detail where student should scan and what knowledge they gain..."
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none resize-none"
                      />
                    </div>

                    <div className="md:col-span-12 flex justify-end gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex items-center gap-1 px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono text-[10px] font-bold uppercase rounded transition-all"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {editingQuestId ? 'Update Quest Module' : 'Incorporate Quest Module'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quests Database Table */}
            <div className="bg-[#131315] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#201f21] border-b border-gray-800 text-gray-400">
                    <tr>
                      <th className="p-4 uppercase text-[10px]">ID</th>
                      <th className="p-4 uppercase text-[10px]">Name</th>
                      <th className="p-4 uppercase text-[10px]">Scannable Code</th>
                      <th className="p-4 uppercase text-[10px]">Reward XP</th>
                      <th className="p-4 uppercase text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {quests.map((q) => (
                      <tr key={q.id} className="hover:bg-black/20 transition-colors">
                        <td className="p-4 font-bold text-[#deed00]">{q.id}</td>
                        <td className="p-4">
                          <div className="font-sans font-bold text-white">{q.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{q.description}</div>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-1 bg-black/60 border border-gray-800 text-[#00f0ff] rounded font-bold">
                            {q.code}
                          </span>
                        </td>
                        <td className="p-4 text-emerald-400 font-bold">+{q.reward} XP</td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => startEditQuest(q)}
                              className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded transition-colors"
                              title="Edit Quest"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                playClick(300);
                                onDeleteQuest(q.id);
                              }}
                              className="p-1.5 hover:bg-red-950/40 text-gray-400 hover:text-red-400 rounded transition-colors"
                              title="Delete Quest"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'agents' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Top Action Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#131315] p-4 border border-gray-800 rounded-xl gap-4">
              <div>
                <span className="font-sans text-xs font-bold text-white uppercase block">Registered Siswa (Agent) Directory</span>
                <span className="font-mono text-[10px] text-gray-500">Monitor levels, distribute experience points, or remove students.</span>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={exportStudentsToExcel}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] uppercase font-bold tracking-wider rounded transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Excel (Siswa)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClick(800);
                    setIsAddingAgent(!isAddingAgent);
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#00f0ff] text-black font-mono text-[10px] uppercase font-bold tracking-wider rounded transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  {isAddingAgent ? 'Close Form' : 'Register Custom Student'}
                </button>
              </div>
            </div>

            {/* Register Custom Agent Form */}
            <AnimatePresence>
              {isAddingAgent && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleCreateAgent} className="bg-[#131315] border border-gray-800 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-5 gap-4">
                    <div className="sm:col-span-5 border-b border-gray-800 pb-2">
                      <span className="font-mono text-[10px] text-[#deed00] uppercase tracking-wider font-bold">
                        REGISTRATION PROTOCOL (ADMIN REGISTER)
                      </span>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Nama Lengkap (Full Name)</label>
                      <input
                        type="text"
                        required
                        value={agentFullName}
                        onChange={(e) => setAgentFullName(e.target.value)}
                        placeholder="Nama lengkap siswa..."
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none"
                      />
                    </div>

                    {/* Alias name */}
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Alias Code Name</label>
                      <input
                        type="text"
                        required
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        placeholder="e.g. Raden Syber"
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none"
                      />
                    </div>

                    {/* NIS */}
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">NIS</label>
                      <input
                        type="text"
                        required
                        value={agentNis}
                        onChange={(e) => setAgentNis(e.target.value)}
                        placeholder="NIS siswa..."
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none"
                      />
                    </div>

                    {/* Jurusan */}
                    <div className="space-y-1.5 sm:col-span-1">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Jurusan</label>
                      <select
                        value={agentJurusan}
                        onChange={(e) => setAgentJurusan(e.target.value)}
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none"
                      >
                        <option value="RPL">RPL</option>
                        <option value="DPB">DPB</option>
                        <option value="TKJ">TKJ</option>
                        <option value="DKV">DKV</option>
                        <option value="TITL">TITL</option>
                      </select>
                    </div>

                    {/* Guild */}
                    <div className="space-y-1.5 sm:col-span-3">
                      <label className="block text-[10px] font-mono text-gray-400 uppercase">Guild Group</label>
                      <select
                        value={agentGuild}
                        onChange={(e) => setAgentGuild(e.target.value)}
                        className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none"
                      >
                        {AVAILABLE_GUILDS.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    {/* Submit */}
                    <div className="flex items-end sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 bg-[#deed00] hover:bg-[#deed00]/90 text-black font-mono text-xs font-black uppercase tracking-widest rounded transition-all"
                      >
                        Add Student
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Siswa Directory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div key={agent.name} className="bg-[#131315] border border-gray-800 p-5 rounded-2xl flex flex-col justify-between gap-4 relative overflow-hidden">
                  <div className="flex gap-4 items-start z-10">
                    <img src={agent.avatar} className="w-14 h-14 rounded-full object-cover border border-gray-800 flex-shrink-0" alt={agent.name} />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-sans font-black text-white text-base uppercase truncate">{agent.fullName || agent.name}</div>
                        <GuildIcon guildName={agent.guild} className="w-5 h-5 flex-shrink-0" />
                      </div>
                      
                      {agent.fullName && (
                        <div className="font-mono text-[10px] text-gray-500 uppercase truncate">
                          Alias: <span className="text-white font-semibold font-sans">{agent.name}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-2 py-1 border-y border-gray-800/60 my-1 font-mono text-[10px] text-gray-400">
                        <div>NIS: <span className="text-white font-bold">{agent.nis || '-'}</span></div>
                        <div>Jurusan: <span className="text-[#00f0ff] font-bold">{agent.jurusan || '-'}</span></div>
                      </div>

                      <div className="font-mono text-[10px] text-gray-400 uppercase tracking-wide">
                        Guild: <span className="text-white font-bold">{agent.guild}</span>
                      </div>

                      <div className="flex gap-3 text-xs font-mono pt-1">
                        <span className="text-[#deed00]">LVL {agent.level}</span>
                        <span className="text-gray-500">EXP: {agent.exp}/100</span>
                        <span className="text-emerald-400">{agent.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level & Points Modifier Actions */}
                  <div className="flex gap-2 z-10 border-t border-gray-800/80 pt-3 mt-1">
                    <button
                      onClick={() => handleAdjustExp(agent, 20)}
                      className="px-2.5 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-[9px] uppercase tracking-wider rounded transition-all"
                    >
                      +20 EXP
                    </button>
                    <button
                      onClick={() => handleAdjustExp(agent, 100)}
                      className="px-2.5 py-1.5 bg-[#deed00]/10 hover:bg-[#deed00]/20 border border-[#deed00]/30 text-[#deed00] font-mono text-[9px] uppercase tracking-wider rounded transition-all"
                    >
                      +100 EXP (Level)
                    </button>

                    <button
                      onClick={() => {
                        playClick(300);
                        onDeleteAgent(agent.name);
                      }}
                      className="ml-auto p-1.5 hover:bg-red-950/40 text-gray-500 hover:text-red-400 rounded transition-colors"
                      title="Remove Agent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'announcements' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Broadcaster form */}
            <div className="lg:col-span-5 bg-[#131315] border border-gray-800 p-6 rounded-2xl space-y-4 h-fit">
              <div>
                <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#00f0ff] animate-pulse" />
                  Broadcaster Terminal
                </h3>
                <p className="font-mono text-[11px] text-gray-500">Post notifications that show instantly in student's HUD.</p>
              </div>

              <form onSubmit={handlePostAnnouncement} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Announcement Title</label>
                  <input
                    type="text"
                    required
                    value={announceTitle}
                    onChange={(e) => setAnnounceTitle(e.target.value)}
                    placeholder="e.g. Pembukaan MPLS Dimulai!"
                    className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Alert Severity level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['INFO', 'WARNING', 'ALERT'] as const).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => {
                          playClick(600);
                          setAnnounceSeverity(sev);
                        }}
                        className={`py-1.5 font-mono text-[9px] uppercase border rounded transition-all ${
                          announceSeverity === sev
                            ? sev === 'ALERT'
                              ? 'bg-red-950/40 border-red-500 text-red-400 font-bold'
                              : sev === 'WARNING'
                              ? 'bg-amber-950/40 border-amber-500 text-amber-400 font-bold'
                              : 'bg-blue-950/40 border-blue-500 text-blue-400 font-bold'
                            : 'bg-black/40 border-gray-800 text-gray-500'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-gray-500 uppercase">Alert Broadcast Message</label>
                  <textarea
                    required
                    rows={4}
                    value={announceContent}
                    onChange={(e) => setAnnounceContent(e.target.value)}
                    placeholder="Provide description of what steps students should execute..."
                    className="w-full bg-black/60 border border-gray-800 text-white px-3 py-2 text-xs rounded focus:border-[#deed00] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono text-xs font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                >
                  Post & Launch Alert
                </button>
              </form>
            </div>

            {/* Live Announcements list */}
            <div className="lg:col-span-7 bg-[#131315] border border-gray-800 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide">
                  Active Live Broadcasts
                </h3>
                <p className="font-mono text-[11px] text-gray-500">Currently deployed messages to all student modules.</p>
              </div>

              <div className="space-y-3">
                {announcements.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-gray-800 rounded-xl">
                    <Radio className="w-8 h-8 text-gray-600 mx-auto mb-2 animate-ping" />
                    <span className="font-mono text-xs text-gray-500 uppercase">No active announcements broadcasted</span>
                  </div>
                ) : (
                  announcements.map((announce) => (
                    <div
                      key={announce.id}
                      className={`p-4 rounded-xl border flex justify-between gap-3 ${
                        announce.severity === 'ALERT'
                          ? 'bg-red-950/20 border-red-500/30'
                          : announce.severity === 'WARNING'
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : 'bg-[#18181a] border-gray-800'
                      }`}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold ${
                            announce.severity === 'ALERT'
                              ? 'bg-red-500/20 text-red-400'
                              : announce.severity === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {announce.severity}
                          </span>
                          <span className="font-mono text-[10px] text-gray-500">{announce.timestamp}</span>
                        </div>

                        <div className="font-sans font-bold text-sm text-white uppercase">{announce.title}</div>
                        <p className="font-sans text-xs text-gray-400 leading-relaxed">{announce.content}</p>
                      </div>

                      <button
                        onClick={() => {
                          playClick(300);
                          onDeleteAnnouncement(announce.id);
                        }}
                        className="p-1 hover:bg-gray-800/80 text-gray-500 hover:text-white rounded h-fit"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile_id' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6"
          >
            {/* Left side: Admin Profile Editor */}
            <div className="lg:col-span-5 bg-[#131315] border border-gray-800 p-6 rounded-2xl space-y-4">
              <div>
                <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide">
                  Modify Admin Core Biodata
                </h3>
                <p className="font-mono text-[11px] text-gray-500">Update system records for your panitia credentials.</p>
              </div>

              <div className="space-y-3 font-sans text-xs">
                {/* Full name */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    type="text"
                    value={adminFullName}
                    onChange={(e) => setAdminFullName(e.target.value)}
                    className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                  />
                </div>

                {/* Name alias */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Alias / Code Name</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                  />
                </div>

                {/* NIS / Staff ID */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Nomor Induk / Panitia ID</label>
                  <input
                    type="text"
                    value={adminNis}
                    onChange={(e) => setAdminNis(e.target.value)}
                    className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                  />
                </div>

                {/* Major department / Staff role */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Department / Jurusan</label>
                  <input
                    type="text"
                    value={adminJurusan}
                    onChange={(e) => setAdminJurusan(e.target.value)}
                    className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                  />
                </div>

                {/* Security status */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Security Status</label>
                  <select
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value)}
                    className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-xs focus:outline-none"
                  >
                    <option value="SYSTEM OVERLORD">SYSTEM OVERLORD</option>
                    <option value="ACTIVE OPERATIVE">ACTIVE OPERATIVE</option>
                    <option value="CHIEF MONITOR">CHIEF MONITOR</option>
                    <option value="SECURE GATEWAY">SECURE GATEWAY</option>
                  </select>
                </div>

                {/* Sci-Fi Avatars list selection */}
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Tactical Faceprint (Choose Sci-Fi Game Avatar)</label>
                  <div className="flex gap-2 py-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800">
                    {SCIFI_AVATARS.map((av, idx) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setAdminAvatar(av)}
                        className={`relative w-10 h-10 rounded border transition-all flex-shrink-0 ${
                          adminAvatar === av ? 'border-[#deed00] scale-105 shadow-[0_0_10px_rgba(222,237,0,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        title={`Sci-Fi Avatar ${idx + 1}`}
                      >
                        <img src={av} alt="Avatar Selection" className="w-full h-full object-cover rounded" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Admin profile picture */}
                <div className="pt-1">
                  <label className="block text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-1">Or Upload Custom Avatar</label>
                  <label className="flex items-center gap-2 justify-center border border-dashed border-gray-800 hover:border-[#00f0ff] bg-[#09090b]/40 hover:bg-black/80 text-gray-400 hover:text-white px-3 py-2 rounded cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-[#00f0ff]" />
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Upload Profile Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAdminFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Save button */}
                <button
                  onClick={handleSaveAdminProfile}
                  className="w-full py-2 bg-[#deed00] hover:bg-[#deed00]/95 text-black font-mono text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 transition-colors mt-4"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Admin Profile
                </button>
              </div>
            </div>

            {/* Right side: Live Sync ID Card Preview */}
            <div className="lg:col-span-7 space-y-4">
              <IDCard
                agent={{
                  name: adminName,
                  fullName: adminFullName,
                  nis: adminNis,
                  jurusan: adminJurusan,
                  guild: adminGuild,
                  avatar: adminAvatar,
                  status: adminStatus,
                  level: 99,
                  exp: 9999,
                  role: 'admin'
                }}
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'archive' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6"
          >
            {/* Left side: Upload Form */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#131315]/90 border border-gray-800 p-6 rounded-xl space-y-6 relative">
                <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-[#deed00] uppercase tracking-widest bg-black/40 border-b border-l border-gray-800 rounded-tr-xl">
                  SEC-UPLOAD-CORE
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#deed00] font-mono text-[10px] tracking-widest uppercase">
                    <FolderArchive className="w-3.5 h-3.5" />
                    Archive Manager
                  </div>
                  <h3 className="font-display text-lg font-black text-white uppercase tracking-wide">
                    {editingActivityId ? 'Edit Activity Photo' : 'Upload Activity Photo'}
                  </h3>
                  <p className="font-mono text-[10px] text-gray-500">
                    {editingActivityId 
                      ? 'Modify the details of this decrypted record inside the core system.' 
                      : 'Add new activity photos, tag them, and decrypt details directly to the academy landing page.'}
                  </p>
                </div>

                <form onSubmit={handleAddActivitySubmit} className="space-y-4 text-left">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Judul Kegiatan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., PEMBUKAAN MPLS CYBERPUNK 2026"
                      value={actTitle}
                      onChange={(e) => setActTitle(e.target.value)}
                      className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-sm focus:outline-none"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Deskripsi Kegiatan *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Deskripsikan detil aktivitas, pencapaian tim, dan materi yang disampaikan..."
                      value={actDesc}
                      onChange={(e) => setActDesc(e.target.value)}
                      className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-xs focus:outline-none resize-none"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Tags (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="ORIENTATION, LAB, CEREMONY"
                      value={actTags}
                      onChange={(e) => setActTags(e.target.value)}
                      className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-xs focus:outline-none"
                    />
                  </div>

                  {/* Encryption / Sector Code */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Kode Sektor Enkripsi (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., SEC-2026-X"
                      value={actCode}
                      onChange={(e) => setActCode(e.target.value)}
                      className="w-full bg-[#09090b] border border-gray-800 focus:border-[#00f0ff] text-white px-3 py-2 rounded font-sans text-xs focus:outline-none"
                    />
                  </div>

                  {/* Interactive File Dropzone */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      Media File Upload *
                    </label>

                    {actImage ? (
                      <div className="border border-gray-800 rounded-lg overflow-hidden bg-black/40 p-3 space-y-3 relative">
                        <div className="relative aspect-[16/10] bg-black rounded overflow-hidden">
                          <img
                            src={actImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none" />
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-[9px] text-emerald-400">MEDIA_LOADED_OK // 100%</span>
                          <button
                            type="button"
                            onClick={() => {
                              playClick(300);
                              setActImage('');
                            }}
                            className="font-mono text-[9px] text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-500/60 rounded px-2 py-0.5 uppercase transition-all bg-red-950/25"
                          >
                            Recalibrate
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDraggingAct(true);
                        }}
                        onDragLeave={() => setIsDraggingAct(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDraggingAct(false);
                          const file = e.dataTransfer.files?.[0];
                          if (file && file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setActImage(reader.result);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                          isDraggingAct
                            ? 'border-[#00f0ff] bg-[#00f0ff]/5'
                            : 'border-gray-800 bg-[#09090b] hover:border-gray-700'
                        }`}
                      >
                        <label className="cursor-pointer block space-y-2">
                          <Upload className="w-6 h-6 text-[#00f0ff] mx-auto animate-pulse" />
                          <div className="font-mono text-xs text-gray-300 uppercase">
                            Drag & Drop Photo Here
                          </div>
                          <div className="font-mono text-[9px] text-gray-500 uppercase">
                            or click to browse local files
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleActFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Quick Sci-Fi Image Presets */}
                  {!actImage && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider">
                        Atau pilih Preset Aktivitas Sci-Fi
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          {
                            label: 'VR Lab',
                            url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=600'
                          },
                          {
                            label: 'Cyber Rig',
                            url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600'
                          },
                          {
                            label: 'Quantum Net',
                            url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600'
                          }
                        ].map((preset, pIdx) => (
                          <button
                            type="button"
                            key={pIdx}
                            onClick={() => {
                              playClick(900);
                              setActImage(preset.url);
                            }}
                            className="py-1.5 px-2 bg-black border border-gray-800 hover:border-[#deed00] hover:text-[#deed00] text-[9px] font-mono uppercase rounded text-center truncate transition-all"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {editingActivityId && (
                      <button
                        type="button"
                        onClick={() => {
                          playClick(300);
                          setEditingActivityId(null);
                          setActTitle('');
                          setActDesc('');
                          setActTags('DOKUMENTASI, MPLS, KEGIATAN');
                          setActCode('');
                          setActImage('');
                        }}
                        className="w-full py-2 bg-red-950/40 hover:bg-red-950/60 text-red-400 border border-red-500/30 hover:border-red-500/60 font-mono text-xs uppercase tracking-wider rounded transition-all"
                      >
                        Cancel Editing
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#deed00] hover:bg-[#deed00]/90 text-black font-mono text-xs font-black uppercase tracking-wider rounded flex items-center justify-center gap-1.5 transition-all shadow-[0_0_15px_rgba(222,237,0,0.15)]"
                    >
                      {editingActivityId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingActivityId ? 'Update & Commit Record' : 'Commit Record to Vault'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right side: Photo Directory Grid */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#131315]/90 border border-gray-800 p-6 rounded-xl space-y-6 text-left relative">
                <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                  <div className="space-y-1">
                    <div className="text-[10px] font-mono text-[#00f0ff] tracking-widest uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      VAULT DIRECTORY ACTIVE
                    </div>
                    <h3 className="font-display text-lg font-black text-white uppercase tracking-wide">
                      Chrono Directory Sync Logs
                    </h3>
                  </div>
                  <div className="font-mono text-[10px] text-gray-500 bg-black/40 px-2.5 py-1 rounded border border-gray-800">
                    {activities.length} RECORDS
                  </div>
                </div>

                {activities.length === 0 ? (
                  <div className="border border-dashed border-gray-800/80 p-12 rounded-lg text-center space-y-3">
                    <ImageIcon className="w-8 h-8 text-gray-600 mx-auto" />
                    <div className="font-mono text-xs text-gray-500 uppercase">
                      No records logged in network.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[560px] overflow-y-auto pr-2 custom-scrollbar">
                    {activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="bg-black/40 border border-gray-800 hover:border-gray-700 p-4 rounded-lg flex flex-col sm:flex-row gap-4 transition-all"
                      >
                        {/* Thumbnail Viewport */}
                        <div className="w-full sm:w-32 aspect-[16/10] sm:h-20 bg-black rounded overflow-hidden relative flex-shrink-0 border border-gray-800/80">
                          <img
                            src={activity.imageUrl}
                            alt={activity.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_2px] pointer-events-none" />
                        </div>

                        {/* Text Metadata Details */}
                        <div className="flex-grow space-y-2 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[9px] font-mono text-[#deed00] bg-black px-1.5 py-0.5 rounded border border-[#deed00]/20 uppercase">
                                {activity.encryptionCode || `SEC-${activity.id}`}
                              </span>
                              <span className="text-[9px] font-mono text-gray-500 flex items-center gap-1">
                                <Calendar className="w-2.5 h-2.5" />
                                {activity.date}
                              </span>
                            </div>

                            <h4 className="font-sans text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                              {activity.title}
                            </h4>

                            <p className="font-mono text-[10px] text-gray-400 line-clamp-1 leading-normal">
                              {activity.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center border-t border-gray-900 pt-2 font-mono text-[9px] text-gray-500">
                            <span>BY: {activity.uploader}</span>
                            <div className="flex gap-1">
                              {activity.tags?.slice(0, 2).map((t, idx) => (
                                <span key={idx} className="text-gray-600 bg-gray-950 px-1 py-0.2 rounded text-[8px] uppercase">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Actions Area */}
                        <div className="flex items-center justify-end sm:justify-center border-t sm:border-t-0 sm:border-l border-gray-900 pt-3 sm:pt-0 sm:pl-3 flex-shrink-0">
                          {deletingActivityId === activity.id ? (
                            <div className="flex flex-col gap-1.5 items-center">
                              <span className="text-[9px] font-mono text-red-500 font-bold uppercase tracking-wider text-center animate-pulse">
                                Yakin Hapus?
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    playClick(150);
                                    onDeleteActivity(activity.id);
                                    setDeletingActivityId(null);
                                  }}
                                  className="px-2 py-1 bg-red-950/40 text-red-400 hover:bg-red-500 hover:text-black border border-red-500/30 rounded text-[9px] font-mono uppercase font-bold transition-all"
                                >
                                  Ya
                                </button>
                                <button
                                  onClick={() => {
                                    playClick(800);
                                    setDeletingActivityId(null);
                                  }}
                                  className="px-2 py-1 bg-gray-900 text-gray-400 hover:bg-gray-800 rounded text-[9px] font-mono uppercase transition-all"
                                >
                                  Tidak
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex sm:flex-col gap-1.5">
                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  playClick(1000);
                                  setEditingActivityId(activity.id);
                                  setActTitle(activity.title);
                                  setActDesc(activity.description);
                                  setActTags(activity.tags?.join(', ') || '');
                                  setActCode(activity.encryptionCode || '');
                                  setActImage(activity.imageUrl);
                                }}
                                className="p-2 text-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#00f0ff]/10 border border-[#00f0ff]/10 hover:border-[#00f0ff]/30 rounded-lg transition-all"
                                title="Edit Record"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              {/* Delete / Purge Button */}
                              <button
                                onClick={() => {
                                  playClick(150);
                                  setDeletingActivityId(activity.id);
                                }}
                                className="p-2 text-red-500 hover:text-red-400 hover:bg-red-950/20 border border-red-950/20 hover:border-red-500/40 rounded-lg transition-all"
                                title="Purge Record"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
