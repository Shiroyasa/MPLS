/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Lock, ShieldCheck, HelpCircle, Eye } from 'lucide-react';
import { Quest } from '../types';

interface QuestLogProps {
  quests: Quest[];
}

export default function QuestLog({ quests }: QuestLogProps) {
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  const completedCount = quests.filter((q) => q.status !== 'Locked').length;

  return (
    <section className="flex flex-col gap-4 mt-8">
      {/* Header and Region indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white">Daily Quest Log: Day 1</h2>
          <span className="bg-[#deed00]/10 text-[#deed00] border border-[#deed00]/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold">
            COMPLETED: {completedCount} / {quests.length}
          </span>
        </div>
        <span className="text-[#00f0ff] font-mono text-xs tracking-wider">Region: Main_Campus_2026</span>
      </div>

      {/* Interactive Cyber Table Container */}
      <div className="border border-[#929277]/30 bg-black/80 rounded-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            {/* Table Head */}
            <thead className="bg-[#201f21] border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-gray-500 uppercase tracking-widest text-[10px]">Nama Aktivitas</th>
                <th className="px-6 py-4 text-gray-500 uppercase tracking-widest text-[10px]">Jam Scan</th>
                <th className="px-6 py-4 text-gray-500 uppercase tracking-widest text-[10px]">Status Kehadiran</th>
                <th className="px-6 py-4 text-gray-500 uppercase tracking-widest text-[10px]">Reward Points</th>
                <th className="px-6 py-4 text-gray-500 uppercase tracking-widest text-[10px] text-right">Details</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-800/60">
              {quests.map((quest) => {
                const isCompleted = quest.status !== 'Locked';
                const isSelected = selectedQuestId === quest.id;

                return (
                  <tr
                    key={quest.id}
                    onClick={() => setSelectedQuestId(isSelected ? null : quest.id)}
                    className={`cursor-pointer transition-all duration-200 ${
                      isCompleted
                        ? 'hover:bg-gray-800/30'
                        : 'opacity-45 bg-[#0e0e10]/40 hover:bg-gray-800/10'
                    } ${isSelected ? 'bg-gray-800/40' : ''}`}
                  >
                    {/* Activity name */}
                    <td className="px-6 py-4 text-white font-medium flex items-center gap-2">
                      <div className="flex flex-col">
                        <span>{quest.name}</span>
                        <span className="text-[9px] text-gray-500 tracking-wider">CODE: {quest.code}</span>
                      </div>
                    </td>

                    {/* Scan time */}
                    <td className="px-6 py-4 text-gray-300">
                      {isCompleted ? quest.time : '-- : --'}
                    </td>

                    {/* Presence status */}
                    <td className="px-6 py-4">
                      {quest.status === 'On-time' && (
                        <span className="inline-flex items-center gap-1.5 text-[#2ae500]">
                          <Check className="w-3.5 h-3.5 fill-[#2ae500]/10" />
                          On-time
                        </span>
                      )}
                      {quest.status === 'Success' && (
                        <span className="inline-flex items-center gap-1.5 text-[#2ae500]">
                          <ShieldCheck className="w-3.5 h-3.5 fill-[#2ae500]/10" />
                          Success
                        </span>
                      )}
                      {quest.status === 'Locked' && (
                        <span className="inline-flex items-center gap-1.5 text-gray-500">
                          <Lock className="w-3.5 h-3.5" />
                          Locked
                        </span>
                      )}
                    </td>

                    {/* Reward Points */}
                    <td className="px-6 py-4">
                      {isCompleted ? (
                        <span className="text-[#deed00] font-bold">+{quest.reward} EXP</span>
                      ) : (
                        <span className="text-gray-500">---</span>
                      )}
                    </td>

                    {/* Toggle expand button */}
                    <td className="px-6 py-4 text-right text-gray-500">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4 ml-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Quest Description Drawer */}
        {selectedQuestId && (
          <div className="bg-[#1b1b1d] border-t border-gray-800 p-5 font-mono text-xs text-gray-400 space-y-2">
            {quests.map((q) => {
              if (q.id !== selectedQuestId) return null;
              return (
                <div key={q.id}>
                  <div className="flex items-center gap-2 text-white font-bold uppercase mb-1">
                    <HelpCircle className="w-4 h-4 text-[#deed00]" />
                    Mission Objective: {q.name}
                  </div>
                  <p className="leading-relaxed text-gray-300">
                    {q.description}
                  </p>
                  {q.status !== 'Locked' ? (
                    <div className="mt-3 text-emerald-400 flex items-center gap-1">
                      ✓ SYNCHRONISED AT {q.time} WIB. DECRYPTED ACCESS PORT {q.code}.
                    </div>
                  ) : (
                    <div className="mt-3 text-[#00f0ff] animate-pulse">
                      » Find and copy code [{q.code}] from the AR Campus Map sector, then paste or enter it in the terminal above.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
