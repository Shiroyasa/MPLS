/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { HelpCircle, Terminal, Play, CornerDownLeft, Sparkles } from 'lucide-react';

interface Inquiry {
  id: string;
  question: string;
  answer: string[];
}

const INQUIRIES: Inquiry[] = [
  {
    id: 'faq-1',
    question: 'Bagaimana cara melakukan absensi / scanning kode?',
    answer: [
      'SYSTEM DETECTED: ORIENTATION_PORT_PROTOCOL',
      '----------------------------------------',
      '1. Kunjungi menu "AR Campus Tour" dari Beranda.',
      '2. Pilih sektor kampus yang sesuai dengan Quest aktif Anda.',
      '3. Salin (Copy) kode akses terminal sektor tersebut (misalnya: APEL-07).',
      '4. Kembali ke menu "Missions" dan tempel kode di menu "Input ID Code" lalu tekan VALIDATE.',
      '5. ATAU: Cukup klik tombol simulasi instan di bawah Scanner untuk melakukan scan virtual dalam satu klik.',
      'SUCCESS: Sinkronisasi akan memperbarui status kehadiran Anda secara instan.'
    ]
  },
  {
    id: 'faq-2',
    question: 'Bagaimana cara menaikkan Level Agent saya?',
    answer: [
      'SYSTEM DETECTED: AGENT_MATRIX_REWARDS',
      '-------------------------------------',
      '- Setiap absensi atau check-in quest yang sukses memberikan sejumlah EXP.',
      '- Anda membutuhkan 100 EXP untuk naik ke tingkat (Level) berikutnya.',
      '- Menaikkan Level akan membuka modul implantasi fungsional langka di faksi "Inventory" Anda.',
      '- Tingkatkan sinkronisasi Anda untuk menduduki peringkat teratas pada "Cyber Leaderboard".'
    ]
  },
  {
    id: 'faq-3',
    question: 'Apa fungsi faksi / Guild di MPLS 2026?',
    answer: [
      'SYSTEM DETECTED: GUILD_COHESION_PROTOCOL',
      '----------------------------------------',
      '- Guild adalah faksi taktis yang menyatukan operatif berdasarkan minat teknologis.',
      '- Cyber Fox: Fokus pada kriptografi, penyusupan nirkabel, dan enkripsi data.',
      '- Bio Mech: Spesialisasi dalam prosthesis hibrida dan modifikasi organik.',
      '- Shadow Grid: Keahlian menyamar di dalam jaringan intranet awan tertutup.',
      '- Neural Synapse: Meneliti interaksi otak manusia langsung dengan server-side tutor.'
    ]
  },
  {
    id: 'faq-4',
    question: 'Saya tidak sengaja merusak enkripsi Neural Link saya!',
    answer: [
      'SYSTEM DETECTED: EMERGENCY_FORMAT_SYNC',
      '---------------------------------------',
      '- Jika data otentikasi profil Anda rusak atau Anda ingin mengulang dari awal:',
      '- Silakan kunjungi panel "Current Agent Status" Anda.',
      '- Gulir ke bagian paling bawah, lalu klik tombol merah "[FORMAT NEURAL CODES]".',
      '- Ini akan menghapus implantasi lokal dan membawa Anda kembali ke Welcome Gate untuk sinkronisasi ulang.'
    ]
  }
];

export default function HelpDeskPanel() {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry>(INQUIRIES[0]);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);

  // Typewriter effect simulation for the terminal
  useEffect(() => {
    setTypedLines([]);
    setLineIndex(0);
  }, [selectedInquiry]);

  useEffect(() => {
    if (lineIndex < selectedInquiry.answer.length) {
      const timer = setTimeout(() => {
        setTypedLines((prev) => [...prev, selectedInquiry.answer[lineIndex]]);
        setLineIndex((prev) => prev + 1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [lineIndex, selectedInquiry]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="font-sans text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <Terminal className="w-8 h-8 text-[#00f0ff]" />
          Terminal <span className="text-[#00f0ff]">Support & FAQ</span>
        </h1>
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">
          Direct automated console for class of ’26 queries
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Questions List */}
        <div className="md:col-span-5 flex flex-col gap-3">
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest pb-1 border-b border-gray-800">
            Select Inquiry Directive
          </span>

          {INQUIRIES.map((faq) => {
            const isSelected = selectedInquiry.id === faq.id;
            return (
              <button
                key={faq.id}
                onClick={() => setSelectedInquiry(faq)}
                className={`w-full p-4 rounded-lg border text-left font-mono text-xs transition-all flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#131315] border-[#00f0ff] text-white shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                    : 'bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                }`}
              >
                <span>{faq.question}</span>
                <Play className={`w-3 h-3 flex-shrink-0 ${isSelected ? 'text-[#00f0ff]' : 'text-gray-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: CRT Terminal Response */}
        <div className="md:col-span-7">
          <div className="border border-[#929277]/30 rounded-xl overflow-hidden bg-black shadow-2xl">
            {/* Terminal Top Window Bar */}
            <div className="bg-[#201f21] px-4 py-2 flex items-center justify-between border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
              </div>
              <span className="font-mono text-[9px] text-gray-500 tracking-wider">
                COGNITIVE_REPLY_TERMINAL.SH
              </span>
            </div>

            {/* Terminal Body Screen */}
            <div className="p-6 h-80 overflow-y-auto font-mono text-xs text-[#2ae500] space-y-2.5 bg-[#070709] relative">
              {/* Scanline flickering filter */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20" />

              {typedLines.map((line, idx) => (
                <div key={idx} className="leading-relaxed">
                  <span className="text-[#00f0ff] mr-1.5">»</span>
                  {line}
                </div>
              ))}

              {/* Cursor Blinking */}
              {lineIndex < selectedInquiry.answer.length ? (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-4 bg-[#2ae500] animate-pulse" />
                  <span className="text-[10px] text-gray-600">Syncing cognitive nets...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">Terminal ready. Type inquiry...</span>
                  <span className="w-2.5 h-4 bg-[#2ae500] animate-ping" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
