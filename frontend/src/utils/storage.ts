import type { AbandonedItem, AntiLibraryStats, Category } from '../types';

const STORAGE_KEY = 'anti_library_items_v1';
const SOUND_SETTINGS_KEY = 'anti_library_sound_enabled';

// Estimated average remaining hours saved if dropped
export const CATEGORY_HOURS_ESTIMATE: Record<Category, number> = {
  'Book': 9,                 // ~300 pages remaining = ~9 hours
  'Movie/Show': 8,           // Unfinished season = ~8 hours
  'Game': 28,                // RPG/open-world remaining = ~28 hours
  'Side Project / Idea': 45, // Prematurely optimized SaaS/CLI = ~45 hours
  'Course / Tutorial': 18,   // Stalled 40-hour deep-dive = ~18 hours
  'Other': 6
};

export const SAMPLE_DATA: AbandonedItem[] = [
  {
    id: 'seed-1',
    title: 'Infinite Jest by David Foster Wallace',
    category: 'Book',
    droppedAt: 'Page 218 (Somewhere in footnote 74)',
    abandonReason: 'Felt like reading tax law written by an encyclopedic genius',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 73, // 73 days ago
    lastInteractedAt: Date.now() - 1000 * 60 * 60 * 24 * 73,
    status: 'In Limbo',
    streakOrRevivalCount: 0
  },
  {
    id: 'seed-2',
    title: 'Building a Rust High-Performance Markdown Parser',
    category: 'Side Project / Idea',
    droppedAt: 'Borrow checker error at src/ast/node.rs',
    abandonReason: 'Decided existing parsers in C are actually quite charming',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 142,
    lastInteractedAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
    status: 'In Limbo',
    streakOrRevivalCount: 1
  },
  {
    id: 'seed-3',
    title: 'Elden Ring: Malenia Blade of Miquella',
    category: 'Game',
    droppedAt: 'Haligtree Roots grace (Attempt #68)',
    abandonReason: 'Waterfowl Dance broke my spirit and my right bumper',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 88,
    lastInteractedAt: Date.now() - 1000 * 60 * 60 * 24 * 88,
    status: 'In Limbo',
    streakOrRevivalCount: 0
  },
  {
    id: 'seed-4',
    title: 'Dark: Season 3 (Netflix)',
    category: 'Movie/Show',
    droppedAt: 'Episode 4 (The Multiverse Genealogy Chart)',
    abandonReason: 'Needed a PhD in quantum mechanics and a whiteboard just to follow breakfast',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 210,
    lastInteractedAt: Date.now() - 1000 * 60 * 60 * 24 * 180,
    status: 'Officially Dead',
    deathEpitaph: 'Some loops are better left broken. May Jonas rest in peace across all dimensions.',
    streakOrRevivalCount: 0
  },
  {
    id: 'seed-5',
    title: 'Advanced Kubernetes in Production',
    category: 'Course / Tutorial',
    droppedAt: 'Module 6: Multi-cluster Service Meshes & Istio',
    abandonReason: 'YAML fatigue and existential dread',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 95,
    lastInteractedAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    status: 'Reviving',
    streakOrRevivalCount: 2
  },
  {
    id: 'seed-6',
    title: 'Duolingo French Streak',
    category: 'Other',
    droppedAt: 'Day 38: Subjunctive verb conjugations',
    abandonReason: 'The green owl’s threatening passive-aggressive push notifications',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 310,
    lastInteractedAt: Date.now() - 1000 * 60 * 60 * 24 * 290,
    status: 'Officially Dead',
    deathEpitaph: 'Je ne regrette rien. Not even failing unit 4.',
    streakOrRevivalCount: 0
  }
];

export function getStoredItems(): AbandonedItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First load: initialize with relatable sample items
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_DATA));
      return SAMPLE_DATA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SAMPLE_DATA;
  } catch (e) {
    console.error('Failed to load items from storage:', e);
    return SAMPLE_DATA;
  }
}

export function saveItems(items: AbandonedItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to storage:', e);
  }
}

export function exportItemsToJson(items: AbandonedItem[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `anti_library_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function parseImportedJson(jsonText: string): AbandonedItem[] {
  const parsed = JSON.parse(jsonText);
  if (!Array.isArray(parsed)) {
    throw new Error("Invalid backup: JSON must be an array of items");
  }
  // Validate schema
  return parsed.map((item, idx) => {
    if (!item.title || typeof item.title !== 'string') {
      throw new Error(`Item at index ${idx} is missing a valid title`);
    }
    return {
      id: item.id || `imported-${Date.now()}-${idx}`,
      title: item.title,
      category: item.category || 'Other',
      droppedAt: item.droppedAt || 'Unknown location',
      abandonReason: item.abandonReason || 'Unspecified',
      dateAdded: typeof item.dateAdded === 'number' ? item.dateAdded : Date.now(),
      lastInteractedAt: typeof item.lastInteractedAt === 'number' ? item.lastInteractedAt : Date.now(),
      status: item.status || 'In Limbo',
      deathEpitaph: item.deathEpitaph,
      streakOrRevivalCount: typeof item.streakOrRevivalCount === 'number' ? item.streakOrRevivalCount : 0
    };
  });
}

export function calculateDaysLingering(dateAdded: number): number {
  const diffMs = Math.max(0, Date.now() - dateAdded);
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function computeStats(items: AbandonedItem[]): AntiLibraryStats {
  const breakdown: Record<Category, number> = {
    'Book': 0,
    'Movie/Show': 0,
    'Game': 0,
    'Side Project / Idea': 0,
    'Course / Tutorial': 0,
    'Other': 0
  };

  let inLimbo = 0;
  let reviving = 0;
  let dead = 0;
  let completed = 0;
  let longestDays = 0;
  let totalReclaimedHours = 0;

  for (const item of items) {
    if (breakdown[item.category] !== undefined) {
      breakdown[item.category]++;
    } else {
      breakdown['Other']++;
    }

    const days = calculateDaysLingering(item.dateAdded);
    if (days > longestDays) {
      longestDays = days;
    }

    if (item.status === 'In Limbo') inLimbo++;
    else if (item.status === 'Reviving') reviving++;
    else if (item.status === 'Officially Dead') {
      dead++;
      totalReclaimedHours += (CATEGORY_HOURS_ESTIMATE[item.category] || 8);
    } else if (item.status === 'Completed') {
      completed++;
    }
  }

  return {
    totalItems: items.length,
    inLimboCount: inLimbo,
    revivingCount: reviving,
    deadCount: dead,
    completedCount: completed,
    estimatedHoursReclaimed: totalReclaimedHours,
    longestLingeringDays: longestDays,
    categoryBreakdown: breakdown
  };
}

export function getSoundSetting(): boolean {
  try {
    const val = localStorage.getItem(SOUND_SETTINGS_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

export function setSoundSetting(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_SETTINGS_KEY, String(enabled));
  } catch {
    // ignore
  }
}
