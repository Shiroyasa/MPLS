/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Trophy, Shield, Award, Search, Sparkles } from 'lucide-react';
import { Agent, LeaderboardEntry } from '../types';

interface LeaderboardPanelProps {
  userAgent: Agent;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Reza Cyberpunk', guild: 'Group 03 - SHADOW GRID', level: 15, exp: 1450 },
  { rank: 2, name: 'Siti Cyber', guild: 'Group 01 - BIO MECH', level: 14, exp: 1320 },
  { rank: 3, name: 'Budi Techno', guild: 'Group 04 - NEURAL SYNAPSE', level: 13, exp: 1210 },
  { rank: 4, name: 'Dian Matrix', guild: 'Group 02 - CYBER FOX', level: 12, exp: 1100 },
  { rank: 5, name: 'Eko Wire', guild: 'Group 03 - SHADOW GRID', level: 11, exp: 1050 },
  { rank: 6, name: 'Lia Synapse', guild: 'Group 04 - NEURAL SYNAPSE', level: 10, exp: 920 },
  { rank: 7, name: 'Kiki Bio', guild: 'Group 01 - BIO MECH', level: 8, exp: 750 }
];

export default function LeaderboardPanel({ userAgent }: LeaderboardPanelProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Inject the user dynamically based on their current actual level and exp!
    const userEntry: LeaderboardEntry = {
      rank: 0, // calculated below
      name: `${userAgent.name} (You)`,
      guild: userAgent.guild,
      level: Math.floor(userAgent.exp / 100) + 1,
      exp: userAgent.exp,
      isUser: true
    };

    const combined = [...MOCK_LEADERBOARD, userEntry];
    // Sort descending by exp
    combined.sort((a, b) => b.exp - a.exp);

    // Assign rank
    const ranked = combined.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    setEntries(ranked);
  }, [userAgent]);

  const filteredEntries = entries.filter((e) =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.guild.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Trophy className="w-8 h-8 text-[#deed00] animate-bounce" />
            Cyber <span className="text-[#deed00]">Leaderboard</span>
          </h1>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">
            Global Sync rankings for Class of '26
          </p>
        </div>

        {/* Search filter */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Filter agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black border border-gray-800 focus:border-[#deed00] text-white pl-10 pr-4 py-2 rounded-lg font-mono text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="border border-[#929277]/30 bg-[#131315]/90 rounded-xl overflow-hidden backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#201f21] border-b border-gray-800 text-gray-500 uppercase tracking-widest text-[10px]">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4">Guild Division</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4 text-right">Decryption EXP</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/40">
              {filteredEntries.map((entry) => {
                const isTop3 = entry.rank <= 3;
                return (
                  <tr
                    key={entry.rank}
                    className={`transition-colors ${
                      entry.isUser
                        ? 'bg-[#deed00]/10 font-bold border-l-4 border-l-[#deed00]'
                        : 'hover:bg-gray-800/20'
                    }`}
                  >
                    {/* Rank */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {entry.rank === 1 && <Sparkles className="w-4 h-4 text-[#deed00]" />}
                        {entry.rank === 2 && <Award className="w-4 h-4 text-gray-300" />}
                        {entry.rank === 3 && <Award className="w-4 h-4 text-amber-600" />}
                        <span
                          className={`font-bold ${
                            isTop3 ? 'text-white text-sm' : 'text-gray-500'
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </div>
                    </td>

                    {/* Agent name */}
                    <td className="px-6 py-4 font-sans text-sm text-white font-semibold">
                      {entry.name}
                    </td>

                    {/* Guild */}
                    <td className="px-6 py-4 text-gray-400">
                      {entry.guild}
                    </td>

                    {/* Level */}
                    <td className="px-6 py-4">
                      <span className="bg-black/40 border border-gray-800 text-[#00f0ff] px-2 py-0.5 rounded text-[10px] font-bold">
                        LVL {entry.level}
                      </span>
                    </td>

                    {/* EXP */}
                    <td className="px-6 py-4 text-right text-[#deed00] font-bold text-sm">
                      {entry.exp} EXP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
