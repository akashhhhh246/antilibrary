export type Category = 
  | 'Book' 
  | 'Movie/Show' 
  | 'Game' 
  | 'Side Project / Idea' 
  | 'Course / Tutorial' 
  | 'Other';

export type AbandonStatus = 
  | 'In Limbo' 
  | 'Reviving' 
  | 'Officially Dead' 
  | 'Completed';

export interface AbandonedItem {
  id: string;
  title: string;
  category: Category;
  droppedAt: string;           // e.g., "Page 142", "Episode 4", "35% through chapter 3", "Architecture setup"
  abandonReason: string;       // e.g., "Pacing slowed down", "Got busy with finals", "Lost interest"
  dateAdded: number;           // timestamp in ms
  lastInteractedAt: number;    // timestamp in ms
  status: AbandonStatus;
  deathEpitaph?: string;       // eulogy / funny tombstone inscription
  streakOrRevivalCount: number;// completed 20-min revival sessions or attempts
}

export type FilterCategory = 'All' | Category | 'Reviving';

export type SortOption = 'linger-desc' | 'linger-asc' | 'date-desc' | 'title-asc' | 'revivals-desc';

export interface AntiLibraryStats {
  totalItems: number;
  inLimboCount: number;
  revivingCount: number;
  deadCount: number;
  completedCount: number;
  estimatedHoursReclaimed: number;
  longestLingeringDays: number;
  categoryBreakdown: Record<Category, number>;
}
