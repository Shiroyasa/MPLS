/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Video, Keyboard, Scan, Sparkles, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { Quest } from '../types';

interface ScannerPanelProps {
  onScanSuccess: (code: string) => boolean | { success: boolean; questName?: string; reward?: number };
}

export default function ScannerPanel({ onScanSuccess }: ScannerPanelProps) {
  const [mode, setMode] = useState<'scan' | 'input'>('scan');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [scanStatus, setScanStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Play synthesized sci-fi sound effects
  const playSound = (type: 'scan' | 'success' | 'error' | 'click') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'scan') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.3);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(900, now + 0.08);
        osc.frequency.setValueAtTime(1200, now + 0.16);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(90, now + 0.35);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (e) {
      // AudioContext blocked
    }
  };

  const startWebcam = async () => {
    setCameraError(null);
    try {
      playSound('click');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      setCameraError('Permission denied or camera busy. Displaying high-tech camera simulator.');
      setIsCameraActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Turn off camera on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleVerifyCode = (codeToVerify: string) => {
    const codeClean = codeToVerify.trim().toUpperCase();
    if (!codeClean) return;

    playSound('scan');
    const result = onScanSuccess(codeClean);

    if (result && typeof result === 'object' && result.success) {
      playSound('success');
      setScanStatus({
        type: 'success',
        message: `DECRYPT SUCCESS: Joined [${result.questName}] and accumulated +${result.reward} EXP!`
      });
      setManualCode('');
    } else {
      playSound('error');
      setScanStatus({
        type: 'error',
        message: 'DECRYPT ERROR: Access code invalid or already fully synchronised.'
      });
    }

    setTimeout(() => {
      setScanStatus({ type: 'idle', message: '' });
    }, 4500);
  };

  const handleQuickSimulate = (code: string) => {
    handleVerifyCode(code);
  };

  const handleSubmitManual = (e: FormEvent) => {
    e.preventDefault();
    handleVerifyCode(manualCode);
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Scanner Header Banner */}
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#2ae500] rounded-full animate-pulse shadow-[0_0_8px_#2ae500]"></span>
          Scanner Interface V1.0
        </h2>
        <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
          SYS_STATE: {isCameraActive ? 'CAM_ACTIVE' : 'READY'}
        </span>
      </div>

      {/* Main Viewport Card */}
      <div className="relative w-full aspect-video border border-[#929277]/30 bg-black/80 rounded-xl overflow-hidden flex flex-col justify-center items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        {/* Futuristic brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#deed00] m-1" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#deed00] m-1" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#deed00] m-1" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#deed00] m-1" />

        {/* Scan lines & Laser overlay */}
        <div className="absolute inset-0 pointer-events-none z-15">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(42,229,0,0.02)_0%,transparent_80%)]" />
          <div className="w-full h-[1.5px] bg-[#2ae500] absolute top-0 left-0 shadow-[0_0_12px_#2ae500] opacity-85 animate-[scan_3.5s_infinite_ease-in-out]" />
        </div>

        {/* Modes Viewports */}
        <AnimatePresence mode="wait">
          {mode === 'scan' ? (
            <motion.div
              key="camera-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-center items-center"
            >
              {isCameraActive ? (
                /* Live Webcam Feed */
                <div className="absolute inset-0 w-full h-full bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover opacity-75"
                  />
                  {/* Target frame overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-dashed border-[#2ae500]/60 rounded-xl flex items-center justify-center bg-black/10">
                      <Scan className="w-10 h-10 text-[#2ae500]/40 animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : (
                /* High-tech Camera Simulator / Fallback Grid */
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-[#0a0a0d] p-6 text-center">
                  <div className="w-48 h-48 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center mb-4 relative">
                    <Scan className="w-12 h-12 text-gray-700 mb-2" />
                    <span className="text-[10px] text-gray-500 font-mono">TARGET FRAME</span>
                  </div>

                  <p className="font-mono text-[11px] text-gray-500 tracking-wider">
                    {cameraError ? cameraError : 'POSITION DECODE WITHIN TARGET FRAME'}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            /* Input View */
            <motion.div
              key="manual-input-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-center items-center bg-[#0c0c0f]/90 p-6"
            >
              <form onSubmit={handleSubmitManual} className="w-full max-w-sm space-y-4 text-center">
                <span className="font-mono text-xs text-gray-500 uppercase tracking-widest block">
                  SECURE DECRYPTION CODES
                </span>

                <div className="relative">
                  <input
                    type="text"
                    required
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter Sector Access Code..."
                    className="w-full bg-black/80 border border-gray-800 focus:border-[#00f0ff] text-white px-4 py-3 rounded-lg text-center font-mono text-sm tracking-widest placeholder-gray-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                  VALIDATE SECURE LINK
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scan Status Toast Overlay */}
        <AnimatePresence>
          {scanStatus.type !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute bottom-4 left-4 right-4 p-3.5 border rounded-lg flex items-start gap-3 backdrop-blur-md z-30 shadow-lg ${
                scanStatus.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-400'
                  : 'bg-red-950/90 border-red-500/40 text-red-400'
              }`}
            >
              {scanStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-400" />
              )}
              <span className="font-mono text-xs leading-relaxed">{scanStatus.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4">
        {mode === 'scan' ? (
          <button
            onClick={() => {
              if (isCameraActive) {
                stopWebcam();
              } else {
                startWebcam();
              }
            }}
            className="flex-1 py-4 bg-[#2ae500] hover:bg-[#2ae500]/90 text-black font-mono text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(42,229,0,0.15)]"
          >
            <Video className="w-4 h-4" />
            {isCameraActive ? 'Deactivate Camera' : 'Open Camera'}
          </button>
        ) : (
          <button
            onClick={() => {
              playSound('click');
              setMode('scan');
            }}
            className="flex-1 py-4 border border-[#2ae500]/40 text-[#2ae500] hover:bg-[#2ae500]/10 font-mono text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Scan className="w-4 h-4" />
            Launch Scanner View
          </button>
        )}

        <button
          onClick={() => {
            playSound('click');
            if (isCameraActive) stopWebcam();
            setMode(mode === 'scan' ? 'input' : 'scan');
          }}
          className="flex-1 py-4 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff]/10 font-mono text-xs uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Keyboard className="w-4 h-4" />
          {mode === 'scan' ? 'Input ID Code' : 'Scanner Interface'}
        </button>
      </div>

      {/* Quick Simulation Cards (Under scanner for awesome, flawless simulation) */}
      <div className="bg-[#131315]/70 border border-gray-800 p-4 rounded-xl">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-[#00f0ff]" />
          Scan Simulation Pad (Click to simulate a physical scan)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: 'Apel Pagi', code: 'APEL-07' },
            { name: 'Tour Lab', code: 'TOUR-09' },
            { name: 'Seminar', code: 'SEMINAR-14' },
            { name: 'AI Workshop', code: 'AI-2026' }
          ].map((sc) => (
            <button
              key={sc.code}
              onClick={() => handleQuickSimulate(sc.code)}
              className="px-3 py-2 bg-black/60 hover:bg-[#deed00]/10 border border-gray-800 hover:border-[#deed00]/30 text-gray-300 hover:text-white rounded-lg text-left transition-all"
            >
              <div className="font-mono text-[9px] text-gray-500 uppercase">{sc.name}</div>
              <div className="font-mono text-xs font-bold text-[#deed00] tracking-wider">{sc.code}</div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
