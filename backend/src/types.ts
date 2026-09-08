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
  droppedAt: string;
  abandonReason: string;
  dateAdded: number;
  lastInteractedAt: number;
  status: AbandonStatus;
  deathEpitaph?: string;
  streakOrRevivalCount: number;
}

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
