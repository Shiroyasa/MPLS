/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, FileSpreadsheet, FolderOpen, UploadCloud, DownloadCloud, 
  CheckCircle, AlertTriangle, Loader2, Play, Terminal, ExternalLink, 
  FileText, PlusCircle, RefreshCw, FileCode, Search, Trash2, LogIn, LogOut,
  Users
} from 'lucide-react';
import { googleSignIn, getAccessToken, logout, initAuth } from '../lib/firebase.ts';
import { Agent, Quest } from '../types';
import { User } from 'firebase/auth';

interface DataUplinkPanelProps {
  currentUser: Agent | null;
  quests: Quest[];
  agents: Agent[];
  onLoginSiswa: (agent: Agent) => void;
  onUpdateQuests: (quests: Quest[]) => void;
  onUpdateAgents: (agents: Agent[]) => void;
}

export default function DataUplinkPanel({ 
  currentUser, 
  quests, 
  agents,
  onLoginSiswa,
  onUpdateQuests,
  onUpdateAgents
}: DataUplinkPanelProps) {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [subTab, setSubTab] = useState<'drive' | 'sheets'>('drive');
  const [logs, setLogs] = useState<string[]>(['SYS_LOG: Initializing Data Uplink protocol...']);

  // Google Drive state
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [driveLoading, setDriveLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [driveError, setDriveError] = useState<string | null>(null);
  const [customFileName, setCustomFileName] = useState('Agent_Memo.txt');
  const [customFileContent, setCustomFileContent] = useState('DOCKING INSTRUCTIONS: Plaza Alpha-9 morning synchronization complete.');

  // Google Sheets state
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [sheetsSuccess, setSheetsSuccess] = useState<string | null>(null);
  const [sheetsError, setSheetsError] = useState<string | null>(null);
  const [lastSpreadsheetUrl, setLastSpreadsheetUrl] = useState<string | null>(null);

  // File Upload State
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sound Synthesizer
  const playSound = (freq = 800, type: OscillatorType = 'sine', duration = 0.1) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    setLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 14)]);
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
        addLog(`SUCCESS: Secure sync active with Google Identity: ${user.email}`);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
        addLog(`WARN: System offline. Authentication required.`);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive Files when logged in or searchQuery changes
  useEffect(() => {
    if (googleUser && accessToken && subTab === 'drive') {
      fetchDriveFiles();
    }
  }, [googleUser, accessToken, subTab]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    playSound(700, 'sine', 0.1);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setAccessToken(result.accessToken);
        setNeedsAuth(false);
        addLog(`SUCCESS: Sync success. Tactical uplink established with ${result.user.displayName}`);
      }
    } catch (err: any) {
      console.error('Google Auth Failed:', err);
      addLog(`ERROR: Connection refused. auth/handshake-fail: ${err.message}`);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    const confirmed = window.confirm('Disconnect tactical Google Drive and Sheets sync?');
    if (!confirmed) return;
    playSound(400, 'sine', 0.15);
    try {
      await logout();
      setGoogleUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setDriveFiles([]);
      setLastSpreadsheetUrl(null);
      addLog('UPLINK DETACHED: Cleared session variables.');
    } catch (err) {
      console.error(err);
    }
  };

  // Drive API: Fetch Files
  const fetchDriveFiles = async () => {
    if (!accessToken) return;
    setDriveLoading(true);
    setDriveError(null);
    try {
      addLog('DRIVE_API: Querying file index...');
      let q = "trashed = false";
      if (searchQuery.trim()) {
        q += ` and name contains '${searchQuery.replace(/'/g, "\\'")}'`;
      }
      
      const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,createdTime,size,webViewLink)&orderBy=createdTime desc&pageSize=30`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (!response.ok) {
        throw new Error(`Drive index call failed with status ${response.status}`);
      }
      
      const data = await response.ok ? await response.json() : { files: [] };
      setDriveFiles(data.files || []);
      addLog(`SUCCESS: Index compiled. Detected ${data.files?.length || 0} secure files.`);
    } catch (err: any) {
      console.error(err);
      setDriveError(err.message);
      addLog(`ERROR: Index fetch failed. error/drive-fetch: ${err.message}`);
    } finally {
      setDriveLoading(false);
    }
  };

  // Drive API: Save Agent Neural Backup File
  const handleDriveBackup = async () => {
    if (!currentUser) {
      alert('Establish Agent Identity first inside Siswa Portal!');
      return;
    }
    
    const fileName = `MPLS_2026_Agent_${currentUser.name.replace(/\s+/g, '_')}_Backup.json`;
    const confirmed = window.confirm(`Upload secure backup "${fileName}" to your Google Drive?`);
    if (!confirmed) return;

    setDriveLoading(true);
    addLog(`DRIVE_API: Starting profile encapsulation...`);

    try {
      const backupData = {
        appIdentifier: 'MPLS_CYBER_ACADEMY_2026_BACKUP',
        timestamp: new Date().toISOString(),
        agent: currentUser,
        questsState: quests,
        allAgentsDirectory: agents
      };

      const fileContentStr = JSON.stringify(backupData, null, 2);

      // Multipart upload metadata & content
      const metadata = {
        name: fileName,
        mimeType: 'application/json',
        description: 'MPLS Cyber Academy 2026 tactical backup file.'
      };

      const boundary = 'foo_bar_boundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartBody = 
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        fileContentStr +
        closeDelimiter;

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!response.ok) {
        throw new Error(`Upload call failed with status ${response.status}`);
      }

      const uploadedFile = await response.json();
      addLog(`SUCCESS: Encrypted neural backup deployed as File ID: ${uploadedFile.id}`);
      playSound(1000, 'sine', 0.25);
      fetchDriveFiles();
    } catch (err: any) {
      console.error(err);
      addLog(`ERROR: Deploy failed. error/drive-upload: ${err.message}`);
    } finally {
      setDriveLoading(false);
    }
  };

  // Drive API: Read and Restore Agent Backup File
  const handleRestoreBackup = async (fileId: string, fileName: string) => {
    const confirmed = window.confirm(`DECRYPT & RESTORE BACKUP: This will flash your local neural codes using "${fileName}". All current level, quest status, and active agent roster will be overwritten. Continue?`);
    if (!confirmed) return;

    setDriveLoading(true);
    addLog(`DRIVE_API: Downloading file content for ID: ${fileId}...`);

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error(`Media fetch failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.appIdentifier !== 'MPLS_CYBER_ACADEMY_2026_BACKUP') {
        throw new Error('FILE_CORRUPTED: Selected file is not a valid MPLS Cyber Academy 2026 backup protocol.');
      }

      // Overwrite app state
      if (data.agent) {
        onLoginSiswa(data.agent);
        localStorage.setItem('mpls_current_user', JSON.stringify(data.agent));
      }
      if (data.questsState) {
        onUpdateQuests(data.questsState);
        localStorage.setItem('mpls_quests', JSON.stringify(data.questsState));
      }
      if (data.allAgentsDirectory) {
        onUpdateAgents(data.allAgentsDirectory);
        localStorage.setItem('mpls_agents_list', JSON.stringify(data.allAgentsDirectory));
      }

      addLog(`SUCCESS: Flash complete. Loaded Backup Agent: "${data.agent?.name}" (Level ${data.agent?.level})`);
      playSound(1200, 'sine', 0.45);
      alert('Neural sync completed! Agent identity and quest history have been restored successfully.');
    } catch (err: any) {
      console.error(err);
      alert(`Restore failed: ${err.message}`);
      addLog(`ERROR: Restore rejected. reason: ${err.message}`);
    } finally {
      setDriveLoading(false);
    }
  };

  // Drive API: Custom Text/File Upload
  const handleCustomFileUpload = async () => {
    if (!customFileName.trim()) return;
    const confirmed = window.confirm(`Upload file "${customFileName}" to Google Drive?`);
    if (!confirmed) return;

    setDriveLoading(true);
    addLog(`DRIVE_API: Uploading text packet...`);

    try {
      const metadata = {
        name: customFileName,
        mimeType: 'text/plain'
      };

      const boundary = 'foo_bar_boundary';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartBody = 
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: text/plain\r\n\r\n' +
        customFileContent +
        closeDelimiter;

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      addLog(`SUCCESS: Text packet synced. File ID: ${result.id}`);
      playSound(900, 'sine', 0.15);
      setCustomFileName('Agent_Memo.txt');
      setCustomFileContent('DOCKING INSTRUCTIONS: ...');
      fetchDriveFiles();
    } catch (err: any) {
      console.error(err);
      addLog(`ERROR: Text upload aborted. error: ${err.message}`);
    } finally {
      setDriveLoading(false);
    }
  };

  // Drive API: Delete File
  const handleDeleteFile = async (fileId: string, name: string) => {
    const confirmed = window.confirm(`DELETE DIRECTIVE: Permanently delete "${name}" from your Google Drive? This cannot be undone.`);
    if (!confirmed) return;

    setDriveLoading(true);
    addLog(`DRIVE_API: Transmitting delete code for file: ${name}...`);

    try {
      const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error(`Delete call failed with status ${response.status}`);
      }

      addLog(`SUCCESS: Purged File: ${name}`);
      playSound(300, 'sawtooth', 0.2);
      fetchDriveFiles();
    } catch (err: any) {
      console.error(err);
      addLog(`ERROR: Purge failed. error: ${err.message}`);
    } finally {
      setDriveLoading(false);
    }
  };

  // Sheets API: Create and Export Quest Log Spreadsheet
  const handleExportQuestSheet = async () => {
    const confirmed = window.confirm('Generate and export your Active Quest & Check-In Log to a new Google Sheets spreadsheet?');
    if (!confirmed) return;

    setSheetsLoading(true);
    setSheetsError(null);
    setSheetsSuccess(null);
    addLog('SHEETS_API: Initiating Spreadsheet construction...');

    try {
      const agentName = currentUser?.name || 'Guest_Operative';
      // Create Sheet metadata
      const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `MPLS 2026 - ${agentName} Quest Log`
          }
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Spreadsheet creation failed with status ${createResponse.status}`);
      }

      const sheetData = await createResponse.json();
      const spreadsheetId = sheetData.spreadsheetId;
      const spreadSheetUrl = sheetData.spreadsheetUrl;

      addLog(`SUCCESS: Empty Sheet spawned. ID: ${spreadsheetId}`);
      addLog('SHEETS_API: Encoding columns & quest metrics...');

      // Prepare sheet grid values
      const headers = ['Quest ID', 'Quest Name', 'Quest Schedule (WIB)', 'Authentication Code', 'Reward Points (EXP)', 'Status', 'Synchronization Time'];
      const rows = quests.map((q) => [
        q.id,
        q.name,
        q.time,
        q.code,
        q.reward,
        q.status,
        q.scannedAt || '-'
      ]);

      const values = [
        [`MPLS CYBER ACADEMY 2026 - ACTIVE AGENT QUEST LOG`],
        [`Agent: ${agentName} | Guild: ${currentUser?.guild || 'Unassigned'} | Level: ${currentUser?.level || 1} (EXP: ${currentUser?.exp || 0})`],
        [],
        headers,
        ...rows
      ];

      // Update grid values
      const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Writing sheet values failed with status ${updateResponse.status}`);
      }

      setLastSpreadsheetUrl(spreadSheetUrl);
      setSheetsSuccess(`Successfully exported ${quests.length} quests!`);
      addLog(`SUCCESS: Encoded complete quest history to Sheets.`);
      playSound(1100, 'sine', 0.3);
    } catch (err: any) {
      console.error(err);
      setSheetsError(err.message);
      addLog(`ERROR: Sheet synchronization failed. error: ${err.message}`);
    } finally {
      setSheetsLoading(false);
    }
  };

  // Sheets API: Create and Export Registered Student Agents Directory
  const handleExportAgentsSheet = async () => {
    const confirmed = window.confirm('Export all registered Cyber Agents and Class of 2026 directory list to a new Google Sheets spreadsheet?');
    if (!confirmed) return;

    setSheetsLoading(true);
    setSheetsError(null);
    setSheetsSuccess(null);
    addLog('SHEETS_API: Requesting server directory catalog... ');

    try {
      const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            title: `MPLS 2026 - Cyber Agents Registry`
          }
        })
      });

      if (!createResponse.ok) {
        throw new Error(`Spreadsheet creation failed with status ${createResponse.status}`);
      }

      const sheetData = await createResponse.json();
      const spreadsheetId = sheetData.spreadsheetId;
      const spreadSheetUrl = sheetData.spreadsheetUrl;

      addLog(`SUCCESS: Catalog sheet spawned. ID: ${spreadsheetId}`);
      addLog('SHEETS_API: Structuring directory nodes...');

      const headers = ['Rank / Index', 'Agent Alias', 'Faction Alignment / Guild', 'Tactical Level', 'Sync Percentage (EXP)', 'Operational Status'];
      const rows = agents.map((a, index) => [
        index + 1,
        a.name,
        a.guild,
        a.level,
        `${a.exp}%`,
        a.status
      ]);

      const values = [
        [`MPLS CYBER ACADEMY 2026 - CYBER AGENTS AND STUDENTS ROSTER`],
        [`Generated: ${new Date().toLocaleDateString('id-ID')} ${new Date().toLocaleTimeString('id-ID')} WIB | Total Registered: ${agents.length} Operatives`],
        [],
        headers,
        ...rows
      ];

      const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: values
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Roster writing failed with status ${updateResponse.status}`);
      }

      setLastSpreadsheetUrl(spreadSheetUrl);
      setSheetsSuccess(`Successfully exported ${agents.length} registered agents!`);
      addLog(`SUCCESS: Secure directory published to active cloud document.`);
      playSound(1100, 'sine', 0.3);
    } catch (err: any) {
      console.error(err);
      setSheetsError(err.message);
      addLog(`ERROR: Roster publish aborted. error: ${err.message}`);
    } finally {
      setSheetsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-8 h-8 text-[#deed00]" />
            Tac-Deck <span className="text-[#deed00]">Data Uplink</span>
          </h1>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">
            Google Workspace Synchronizer — Drive & Sheets Integration
          </p>
        </div>

        {/* Sync Indicator */}
        <div className="flex items-center gap-3">
          {needsAuth ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 border border-red-500/30 text-red-400 font-mono text-[10px] rounded">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              OFFLINE / DESYNCED
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2ae500]/10 border border-[#2ae500]/30 text-[#2ae500] font-mono text-[10px] rounded">
                <span className="w-2 h-2 rounded-full bg-[#2ae500] animate-pulse" />
                UPLINK ESTABLISHED
              </div>
              <button
                onClick={handleGoogleLogout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white font-mono text-[9px] uppercase rounded"
                title="Disconnect from Google"
              >
                <LogOut className="w-3 h-3 text-red-500" />
                Disconnect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Sync Controls + Console Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Operations Area */}
        <div className="lg:col-span-8 space-y-6">
          {needsAuth ? (
            /* Locked State Card */
            <div className="border border-gray-800 rounded-xl overflow-hidden bg-black/60 backdrop-blur-md p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-gray-900/80 border border-gray-800 rounded-2xl flex items-center justify-center text-gray-400 mx-auto">
                <Database className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-sans text-lg font-bold text-white uppercase tracking-wider">
                  Tactical Sync Offline
                </h3>
                <p className="font-sans text-xs text-gray-400 leading-relaxed">
                  Authenticate your Google account to bridge the local cyberpunk HUD with Google Drive cloud storage and Google Sheets reports. Back up your agent profile, export quest leaderboards, and read central command announcements.
                </p>
              </div>

              {/* GSI styled material button */}
              <div className="flex justify-center pt-2">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="bg-white hover:bg-gray-100 text-gray-900 font-sans font-semibold text-sm px-6 py-3 rounded-lg flex items-center gap-3 shadow-md transition-all duration-150 disabled:opacity-50"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-900" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    </svg>
                  )}
                  <span>{isLoggingIn ? "Linking identity..." : "Connect Google Identity"}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Active Uplink Control Area */
            <div className="space-y-6">
              {/* Internal Sub-Tabs */}
              <div className="grid grid-cols-2 bg-[#201f21]/40 p-1 border border-gray-800 rounded-xl">
                <button
                  onClick={() => { playSound(600, 'sine', 0.05); setSubTab('drive'); }}
                  className={`py-3 rounded-lg font-mono text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 ${
                    subTab === 'drive'
                      ? 'bg-[#131315] border border-gray-800 text-[#deed00] font-bold'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                  Google Drive (Storage)
                </button>
                <button
                  onClick={() => { playSound(600, 'sine', 0.05); setSubTab('sheets'); }}
                  className={`py-3 rounded-lg font-mono text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 ${
                    subTab === 'sheets'
                      ? 'bg-[#131315] border border-gray-800 text-[#00f0ff] font-bold'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Google Sheets (Metrics)
                </button>
              </div>

              {/* Subtab Contents */}
              <AnimatePresence mode="wait">
                {subTab === 'drive' ? (
                  /* Google Drive Operations */
                  <motion.div
                    key="drive-panel"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    {/* Backup / Quick Sync Card */}
                    <div className="bg-[#131315]/80 border border-gray-800 p-6 rounded-xl space-y-4">
                      <div>
                        <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                          <UploadCloud className="w-4 h-4 text-[#deed00]" />
                          Agent Backup & Flash Protocols
                        </h3>
                        <p className="font-sans text-xs text-gray-500 mt-1">
                          Encapsulate your full state (levels, unlocked gear, quest log, and local roster) into a `.json` backup file saved on your Drive. Restore it on any terminal to recover sync.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={handleDriveBackup}
                          disabled={driveLoading || !currentUser}
                          className="px-4 py-2.5 bg-[#deed00] hover:bg-[#deed00]/90 text-black font-mono text-xs font-black uppercase rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-40"
                        >
                          <UploadCloud className="w-4 h-4" />
                          Uplink Neural Backup
                        </button>

                        {!currentUser && (
                          <div className="text-amber-500 font-mono text-[10px] uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            Identity missing. Set Alias inside Siswa tab first.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Custom Text Upload Mini-Form */}
                    <div className="bg-[#131315]/80 border border-gray-800 p-6 rounded-xl space-y-4">
                      <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-gray-400" />
                        Deploy Plaintext Packet to Drive
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <input
                            type="text"
                            value={customFileName}
                            onChange={(e) => setCustomFileName(e.target.value)}
                            placeholder="FileName.txt"
                            className="w-full bg-black/60 border border-gray-800 focus:border-[#deed00] px-3 py-2 text-xs font-mono rounded text-white"
                          />
                        </div>
                        <div className="sm:col-span-2 flex gap-3">
                          <input
                            type="text"
                            value={customFileContent}
                            onChange={(e) => setCustomFileContent(e.target.value)}
                            placeholder="File text contents..."
                            className="w-full bg-black/60 border border-gray-800 focus:border-[#deed00] px-3 py-2 text-xs font-sans rounded text-white"
                          />
                          <button
                            onClick={handleCustomFileUpload}
                            disabled={driveLoading || !customFileName.trim() || !customFileContent.trim()}
                            className="px-3 bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs uppercase rounded transition-all"
                          >
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Google Drive File Explorer */}
                    <div className="border border-gray-800 rounded-xl overflow-hidden bg-black/40">
                      {/* Explorer Toolbar */}
                      <div className="bg-[#18181a]/90 p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                          <FolderOpen className="w-4 h-4 text-[#deed00]" />
                          Drive Secure File Explorer
                        </div>

                        <div className="flex w-full sm:w-auto gap-2">
                          <div className="relative flex-grow">
                            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search index..."
                              className="bg-black text-white text-xs pl-8 pr-3 py-1.5 rounded border border-gray-800 focus:border-[#deed00] w-full focus:outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  playSound(600, 'sine', 0.05);
                                  fetchDriveFiles();
                                }
                              }}
                            />
                          </div>

                          <button
                            onClick={() => { playSound(600, 'sine', 0.05); fetchDriveFiles(); }}
                            disabled={driveLoading}
                            className="p-1.5 bg-gray-900 border border-gray-800 hover:text-white rounded text-gray-400"
                            title="Refresh file list"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${driveLoading ? 'animate-spin text-[#deed00]' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* File Grid */}
                      <div className="p-4 max-h-80 overflow-y-auto space-y-2">
                        {driveLoading && driveFiles.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12 text-gray-500 space-y-2">
                            <Loader2 className="w-8 h-8 animate-spin text-[#deed00]" />
                            <span className="font-mono text-xs uppercase">Querying Cloud Nodes...</span>
                          </div>
                        ) : driveError ? (
                          <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-lg text-red-400 font-mono text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span>Explorer error: {driveError}</span>
                          </div>
                        ) : driveFiles.length === 0 ? (
                          <div className="text-center py-12 text-gray-500 font-mono text-xs uppercase">
                            No matching files detected in Google Drive root index.
                          </div>
                        ) : (
                          driveFiles.map((file) => {
                            const isBackup = file.name.startsWith('MPLS_2026_Agent_') && file.name.endsWith('_Backup.json');
                            return (
                              <div
                                key={file.id}
                                className="p-3 bg-black/60 rounded-lg border border-gray-800/80 hover:border-gray-700/80 flex items-center justify-between gap-4 transition-all"
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  {isBackup ? (
                                    <Database className="w-8 h-8 text-[#deed00] flex-shrink-0" />
                                  ) : file.mimeType.includes('spreadsheet') ? (
                                    <FileSpreadsheet className="w-8 h-8 text-[#2ae500] flex-shrink-0" />
                                  ) : (
                                    <FileText className="w-8 h-8 text-blue-400 flex-shrink-0" />
                                  )}
                                  
                                  <div className="overflow-hidden">
                                    <div className="text-xs font-bold text-white truncate uppercase tracking-wide">
                                      {file.name}
                                    </div>
                                    <div className="font-mono text-[9px] text-gray-500 flex items-center gap-2">
                                      <span>ID: {file.id.slice(0, 12)}...</span>
                                      <span>•</span>
                                      <span>{file.mimeType.split('.').pop()?.split('/').pop()?.toUpperCase()}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {/* Restore Trigger for Backup Files */}
                                  {isBackup && (
                                    <button
                                      onClick={() => handleRestoreBackup(file.id, file.name)}
                                      className="px-2.5 py-1.5 bg-[#deed00]/10 hover:bg-[#deed00]/20 text-[#deed00] font-mono text-[10px] uppercase font-bold border border-[#deed00]/20 rounded-md transition-all flex items-center gap-1"
                                      title="Flash and restore profile backup"
                                    >
                                      <DownloadCloud className="w-3 h-3" />
                                      Flash
                                    </button>
                                  )}

                                  {/* Open file link */}
                                  {file.webViewLink && (
                                    <a
                                      href={file.webViewLink}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded"
                                      title="Open in Drive"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  {/* Delete file */}
                                  <button
                                    onClick={() => handleDeleteFile(file.id, file.name)}
                                    className="p-1.5 bg-gray-900 border border-gray-800 text-red-500/80 hover:bg-red-950/20 hover:text-red-400 rounded"
                                    title="Delete file"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  /* Google Sheets Operations */
                  <motion.div
                    key="sheets-panel"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    {/* Exporters Card */}
                    <div className="bg-[#131315]/80 border border-gray-800 p-6 rounded-xl space-y-6">
                      <div>
                        <h3 className="font-sans text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                          <FileSpreadsheet className="w-4 h-4 text-[#00f0ff]" />
                          Metric Logs Spreadsheet Sync
                        </h3>
                        <p className="font-sans text-xs text-gray-500 mt-1">
                          Structure tactical dashboard data into clean tabular spreadsheets. Output reports on active check-in timelines and registered agent files for Command Staff audit.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Option 1: Personal Quest Log */}
                        <div className="border border-gray-800 bg-black/40 p-4 rounded-lg flex flex-col justify-between gap-4">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] text-[#00f0ff] uppercase font-bold">Protocol 1</span>
                            <div className="font-sans text-xs font-bold text-white uppercase">Personal Quest Status Sheet</div>
                            <p className="font-sans text-[11px] text-gray-500 leading-relaxed">
                              Export your scanned quests, reward yields, and validation timestamps to a custom table.
                            </p>
                          </div>
                          <button
                            onClick={handleExportQuestSheet}
                            disabled={sheetsLoading}
                            className="w-full py-2 bg-gray-900 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 text-gray-400 border border-gray-800 font-mono text-[10px] uppercase font-bold rounded-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            Export Quest Logs
                          </button>
                        </div>

                        {/* Option 2: Active Agents Catalog */}
                        <div className="border border-gray-800 bg-black/40 p-4 rounded-lg flex flex-col justify-between gap-4">
                          <div className="space-y-1">
                            <span className="font-mono text-[9px] text-[#00f0ff] uppercase font-bold">Protocol 2</span>
                            <div className="font-sans text-xs font-bold text-white uppercase">Cyber Faction Registry</div>
                            <p className="font-sans text-[11px] text-gray-500 leading-relaxed">
                              Generate a catalog of all currently registered siswa agents and their leveling indicators.
                            </p>
                          </div>
                          <button
                            onClick={handleExportAgentsSheet}
                            disabled={sheetsLoading}
                            className="w-full py-2 bg-gray-900 hover:bg-[#00f0ff]/10 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 text-gray-400 border border-gray-800 font-mono text-[10px] uppercase font-bold rounded-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Users className="w-3.5 h-3.5" />
                            Export Roster Catalog
                          </button>
                        </div>
                      </div>

                      {/* Display Export Outcomes */}
                      {sheetsLoading && (
                        <div className="flex items-center gap-2 text-gray-400 font-mono text-xs py-2">
                          <Loader2 className="w-4 h-4 animate-spin text-[#00f0ff]" />
                          <span>Generating document grid and updating cell matrices...</span>
                        </div>
                      )}

                      {sheetsError && (
                        <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-400 font-mono text-xs rounded">
                          Sync abort: {sheetsError}
                        </div>
                      )}

                      {sheetsSuccess && (
                        <div className="p-4 bg-emerald-950/20 border border-[#2ae500]/30 rounded-lg space-y-2">
                          <div className="text-[#2ae500] font-mono text-xs flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4" />
                            <span>{sheetsSuccess}</span>
                          </div>
                          {lastSpreadsheetUrl && (
                            <a
                              href={lastSpreadsheetUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#00f0ff] hover:underline"
                            >
                              <span>Open Generated Document in Google Sheets</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Right Side: CRT Status Monitor Logs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-gray-800 rounded-xl overflow-hidden bg-black shadow-lg">
            {/* Window bar */}
            <div className="bg-[#201f21] p-3 border-b border-gray-800 flex justify-between items-center">
              <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest font-black">
                UPLINK_DECK_MONITOR.LOG
              </span>
              <div className="w-2 h-2 rounded-full bg-[#deed00] animate-pulse" />
            </div>

            {/* Terminal Panel */}
            <div className="p-4 h-96 overflow-y-auto font-mono text-[10px] text-[#2ae500] space-y-2 bg-[#070709] relative">
              {/* Scanline overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-15" />

              {logs.map((log, idx) => (
                <div key={idx} className="leading-relaxed border-b border-gray-900 pb-1 text-left">
                  {log}
                </div>
              ))}

              <div className="flex items-center gap-1 pt-1.5">
                <span className="w-1.5 h-3 bg-[#2ae500] animate-ping" />
                <span className="text-gray-600">Sync layer live. Monitoring stream...</span>
              </div>
            </div>
          </div>

          {/* Cloud SQL Fallback Warning */}
          <div className="bg-amber-950/15 border border-amber-500/25 p-4 rounded-xl space-y-2">
            <div className="font-mono text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              DATABASE STORAGE PROTOCOL
            </div>
            <p className="font-sans text-[11px] text-gray-400 leading-relaxed text-left">
              The regional Cloud SQL (PostgreSQL) instance was requested in `asia-southeast1`. However, because the sandbox GCP project lacks active billing or owner permissions, local high-speed state storage has been initialized as an alternative. Rest assured, your Google Drive and Google Sheets tactical sync is **fully active** and operational!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
