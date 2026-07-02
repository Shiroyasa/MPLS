/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Sparkles, Cpu, Radio, Award, Eye, BatteryCharging } from 'lucide-react';
import { Agent, InventoryItem, Quest } from '../types';

interface InventoryPanelProps {
  userAgent: Agent;
  quests: Quest[];
}

export default function InventoryPanel({ userAgent, quests }: InventoryPanelProps) {
  const completedQuestsCount = quests.filter((q) => q.status !== 'Locked').length;
  const userLevel = Math.floor(userAgent.exp / 100) + 1;

  // Dynamically assemble inventory items based on actual user progression!
  const items: InventoryItem[] = [
    {
      id: 'inv-1',
      name: 'Sub-dermal Neural Injector',
      rarity: 'Common',
      description: 'Standard issue biocapula allowing basic synchronization with Class of ’26 ports.',
      icon: 'injector',
      unlockedAt: 'Unlocked on registration'
    }
  ];

  if (completedQuestsCount >= 2) {
    items.push({
      id: 'inv-2',
      name: 'Cyber Fox Decoder',
      rarity: 'Epic',
      description: 'Advanced decryptor pod designed specifically for Group 02 high-frequency codes.',
      icon: 'decoder',
      unlockedAt: 'Completed 2 orientation quests'
    });
  }

  if (userLevel >= 2) {
    items.push({
      id: 'inv-3',
      name: 'Ocular HUD Upgrader',
      rarity: 'Rare',
      description: 'Retinal lens software injection displaying instant telemetry logs in real-time.',
      icon: 'ocular',
      unlockedAt: 'Reached Level 2'
    });
  }

  if (completedQuestsCount === quests.length) {
    items.push({
      id: 'inv-4',
      name: 'Solar Chronos Core',
      rarity: 'Legendary',
      description: 'Extremely rare quantum core reflecting perpetual sync with the school’s core server.',
      icon: 'chronos',
      unlockedAt: 'All daily quests completed!'
    });
  }

  const getRarityStyles = (rarity: InventoryItem['rarity']) => {
    switch (rarity) {
      case 'Common':
        return 'border-gray-800 text-gray-400 bg-gray-950/20';
      case 'Rare':
        return 'border-blue-500/40 text-blue-400 bg-blue-950/20 shadow-[0_0_10px_rgba(59,130,246,0.15)]';
      case 'Epic':
        return 'border-purple-500/40 text-purple-400 bg-purple-950/20 shadow-[0_0_10px_rgba(168,85,247,0.15)]';
      case 'Legendary':
        return 'border-[#deed00]/40 text-[#deed00] bg-[#deed00]/10 shadow-[0_0_15px_rgba(222,237,0,0.15)]';
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'injector':
        return <Cpu className="w-8 h-8" />;
      case 'decoder':
        return <Radio className="w-8 h-8" />;
      case 'ocular':
        return <Eye className="w-8 h-8" />;
      case 'chronos':
        return <BatteryCharging className="w-8 h-8" />;
      default:
        return <Shield className="w-8 h-8" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="font-sans text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Shield className="w-8 h-8 text-[#00f0ff]" />
            Agent <span className="text-[#00f0ff]">Gear & Inventory</span>
          </h1>
          <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-1">
            Implements and digital badges accumulated during orientation
          </p>
        </div>

        <span className="font-mono text-xs text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-3 py-1 rounded-full">
          Implements Unlocked: {items.length} / 4
        </span>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border p-6 rounded-xl flex items-start gap-5 backdrop-blur-md transition-all ${getRarityStyles(
              item.rarity
            )}`}
          >
            {/* Visual Icon Box */}
            <div className="p-3 bg-black/60 border border-gray-800 rounded-xl text-white flex-shrink-0 flex items-center justify-center">
              {renderIcon(item.icon)}
            </div>

            {/* Core details */}
            <div className="space-y-2 flex-grow">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest bg-black/40 px-2.5 py-0.5 rounded border border-gray-800">
                  {item.rarity}
                </span>
                <span className="font-mono text-[9px] text-gray-500 uppercase">{item.unlockedAt}</span>
              </div>

              <h3 className="font-sans text-base font-bold text-white uppercase tracking-wide">
                {item.name}
              </h3>

              <p className="font-mono text-[11px] text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}

        {items.length < 4 && (
          <div className="border border-dashed border-gray-800 p-8 rounded-xl flex flex-col justify-center items-center text-center text-gray-600">
            <Award className="w-10 h-10 mb-3 opacity-30" />
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider mb-1 text-gray-500">
              Undiscovered Tech Locked
            </h4>
            <p className="font-mono text-[10px] text-gray-500 max-w-xs">
              Continue scanning sector access codes and leveling up your agent matrix to unlock high-yield military implements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
