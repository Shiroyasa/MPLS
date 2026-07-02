/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Agent {
  name: string;
  guild: string;
  level: number;
  exp: number;
  avatar: string;
  status: 'READY TO DISCOVER' | 'ACTIVE OPERATIVE' | 'SYSTEM OVERLORD' | 'NEURAL SYNCED';
  role?: 'admin' | 'siswa';
  fullName?: string;
  nis?: string;
  jurusan?: string;
  completedQuests?: string[];
}

export interface Quest {
  id: string;
  name: string;
  time: string;
  code: string;
  reward: number;
  status: 'Locked' | 'On-time' | 'Success';
  description: string;
  scannedAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  guild: string;
  level: number;
  exp: number;
  isUser?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  severity: 'INFO' | 'WARNING' | 'ALERT';
}

export const AVAILABLE_GUILDS = [
  'Garuda',
  'Candi',
  'Obor',
  'Burung Hantu'
];

export const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1608889174653-815308fc92fc?auto=format&fit=crop&w=250&q=80', // Cute 3D Cyber Robot
  'https://images.unsplash.com/photo-1620428268482-cf1851a36764?auto=format&fit=crop&w=250&q=80', // 3D Red-cap Gaming Boy
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=250&q=80', // 3D Cyberpunk Anime Girl
  'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=250&q=80'  // 3D Cyber Mecha Overlord
];

export const SCIFI_AVATARS = [
  'https://images.unsplash.com/photo-1608889174653-815308fc92fc?auto=format&fit=crop&w=250&q=80', // Cute 3D Cyber Robot
  'https://images.unsplash.com/photo-1620428268482-cf1851a36764?auto=format&fit=crop&w=250&q=80', // 3D Red-cap Gaming Boy
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=250&q=80', // 3D Cyberpunk Anime Girl
  'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=250&q=80', // 3D Cyber Mecha Overlord
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80', // 3D Glowing Neon Virtual Entity
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?auto=format&fit=crop&w=250&q=80', // 3D Cute Round-face Boy Gamer
  'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=250&q=80', // 3D Neon Network Robot Helmet
  'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=250&q=80', // 3D Cybernetic Mind Profile
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=250&q=80', // 3D Futuristic Fluid Entity
  'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&w=250&q=80'  // 3D Tactical Agent with cyber visor
];

export interface ActivityPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  uploader: string;
  tags?: string[];
  encryptionCode?: string;
}

export const INITIAL_ACTIVITIES: ActivityPhoto[] = [
  {
    id: 'ACT-001',
    title: 'Pembukaan MPLS Hybrid Portal',
    description: 'Upacara pembukaan penerimaan calon agen baru MPLS Cyber Academy 2026. Sinkronisasi neural link generasi ke-5 diluncurkan secara penuh.',
    imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    date: '02 July 2026',
    uploader: 'OVERLORD AUTHORITY',
    tags: ['ORIENTATION', 'UPACARA', 'NEURAL-INIT'],
    encryptionCode: 'ARC-7721-INIT'
  },
  {
    id: 'ACT-002',
    title: 'Uji Coba Lab Robotik & Prostetik',
    description: 'Siswa faksi Shadow Grid melakukan kalibrasi lengan robotik berskala industri pada Sektor Lab 303 untuk menyelesaikan Quest harian hulu-hilir.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    date: '02 July 2026',
    uploader: 'SYSTEM OVERLORD',
    tags: ['ROBOTICS', 'LAB-303', 'CALIBRATION'],
    encryptionCode: 'ARC-0941-ROB'
  },
  {
    id: 'ACT-003',
    title: 'Hacking Sandbox Tournament',
    description: 'Kompetisi pemetaan data tertutup di sub-area Sandbox Server Block B-12. Siswa berlomba memecahkan simpul enkripsi firewall faksi lawan.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    date: '01 July 2026',
    uploader: 'PANITIA STAFF',
    tags: ['SANDBOX', 'HACKING', 'TOURNAMENT'],
    encryptionCode: 'ARC-3382-HACK'
  }
];


