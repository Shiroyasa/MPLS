/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Castle, Flame, Eye, LucideIcon } from 'lucide-react';

interface GuildIconProps {
  guildName: string;
  className?: string;
  size?: number;
}

export default function GuildIcon({ guildName, className = "w-4 h-4", size }: GuildIconProps) {
  // Normalize guild name to match the keys
  const normalized = guildName ? guildName.toLowerCase().trim() : '';

  let IconComponent: LucideIcon = Shield;
  let colorClass = "text-[#deed00]"; // default yellow

  if (normalized.includes('garuda')) {
    IconComponent = Shield;
    colorClass = "text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]";
  } else if (normalized.includes('candi')) {
    IconComponent = Castle;
    colorClass = "text-[#00f0ff] drop-shadow-[0_0_4px_rgba(0,240,255,0.5)]";
  } else if (normalized.includes('obor')) {
    IconComponent = Flame;
    colorClass = "text-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]";
  } else if (normalized.includes('hantu') || normalized.includes('burung')) {
    IconComponent = Eye;
    colorClass = "text-purple-400 drop-shadow-[0_0_4px_rgba(192,132,252,0.5)]";
  }

  return (
    <IconComponent 
      className={`${className} ${colorClass}`} 
      size={size} 
    />
  );
}
