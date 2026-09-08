import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AbandonedItem, AntiLibraryStats, Category } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'items.json');

export const CATEGORY_HOURS_ESTIMATE: Record<Category, number> = {
  'Book': 9,
  'Movie/Show': 8,
  'Game': 28,
  'Side Project / Idea': 45,
  'Course / Tutorial': 18,
  'Other': 6
};

export const INITIAL_SAMPLE_DATA: AbandonedItem[] = [
  {
    id: 'seed-1',
    title: 'Infinite Jest by David Foster Wallace',
    category: 'Book',
    droppedAt: 'Page 218 (Somewhere in footnote 74)',
    abandonReason: 'Felt like reading tax law written by an encyclopedic genius',
    dateAdded: Date.now() - 1000 * 60 * 60 * 24 * 73,
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

class StorageManager {
  private items: AbandonedItem[] = [];

  constructor() {
    this.ensureDataFile();
    this.load();
  }

  private ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SAMPLE_DATA, null, 2), 'utf-8');
    }
  }

  private load() {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      this.items = JSON.parse(content);
    } catch (e) {
      console.error('Failed to load storage file, falling back to sample data:', e);
      this.items = [...INITIAL_SAMPLE_DATA];
    }
  }

  private persist() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.items, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist items:', e);
    }
  }

  public getAll(): AbandonedItem[] {
    return [...this.items];
  }

  public getById(id: string): AbandonedItem | undefined {
    return this.items.find((item) => item.id === id);
  }

  public create(data: Omit<AbandonedItem, 'id' | 'dateAdded' | 'lastInteractedAt' | 'streakOrRevivalCount' | 'status'> & { id?: string }): AbandonedItem {
    const newItem: AbandonedItem = {
      id: data.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: data.title,
      category: data.category,
      droppedAt: data.droppedAt,
      abandonReason: data.abandonReason,
      dateAdded: Date.now(),
      lastInteractedAt: Date.now(),
      status: 'In Limbo',
      streakOrRevivalCount: 0
    };
    this.items.unshift(newItem);
    this.persist();
    return newItem;
  }

  public update(id: string, updates: Partial<AbandonedItem>): AbandonedItem | null {
    const idx = this.items.findIndex((item) => item.id === id);
    if (idx === -1) return null;

    this.items[idx] = {
      ...this.items[idx],
      ...updates,
      lastInteractedAt: Date.now()
    };
    this.persist();
    return this.items[idx];
  }

  public delete(id: string): boolean {
    const initialLen = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    if (this.items.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  public getRandomLimboItem(): AbandonedItem | null {
    const limboItems = this.items.filter((item) => item.status === 'In Limbo');
    if (limboItems.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * limboItems.length);
    return limboItems[randomIndex];
  }

  public resetToSample(): AbandonedItem[] {
    this.items = [...INITIAL_SAMPLE_DATA];
    this.persist();
    return [...this.items];
  }

  public bulkImport(newItems: AbandonedItem[]): AbandonedItem[] {
    this.items = newItems;
    this.persist();
    return [...this.items];
  }

  public computeStats(): AntiLibraryStats {
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

    for (const item of this.items) {
      if (breakdown[item.category] !== undefined) {
        breakdown[item.category]++;
      } else {
        breakdown['Other']++;
      }

      const days = Math.floor(Math.max(0, Date.now() - item.dateAdded) / (1000 * 60 * 60 * 24));
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
      totalItems: this.items.length,
      inLimboCount: inLimbo,
      revivingCount: reviving,
      deadCount: dead,
      completedCount: completed,
      estimatedHoursReclaimed: totalReclaimedHours,
      longestLingeringDays: longestDays,
      categoryBreakdown: breakdown
    };
  }
}

export const storage = new StorageManager();
