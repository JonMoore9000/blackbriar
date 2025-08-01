// Core data types for the He is Coming Run Log

export interface GameRun {
  id: string;
  createdAt: string;
  
  // Player info (optional for MVP)
  playerName?: string;
  
  // Run details
  boss: string;
  items: string[];
  
  // Player stats
  hp: number;
  atk: number;
  def: number;
  spd: number;
  
  // Outcome
  outcome: 'victory' | 'defeat';
  deathReason?: string; // Only if outcome is defeat
  notes?: string;
  
  // AI generated content
  aiRoast?: string;
  
  // Engagement metrics
  commentCount: number;
  shareCount: number;
}

export interface Comment {
  id: string;
  runId: string;
  createdAt: string;
  
  // Comment details
  authorName?: string; // Optional anonymous comments
  message: string;
}

export interface Boss {
  id: string;
  name: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'nightmare';
  imageUrl?: string;
  area?: string;
  stats?: {
    hp?: number;
    atk?: number;
    def?: number;
    spd?: number;
  };
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  type?: 'weapon' | 'armor' | 'consumable' | 'artifact';
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary' | 'heroic';
  imageUrl?: string;
  area?: string;
  stats?: {
    hp?: number;
    atk?: number;
    def?: number;
    spd?: number;
  };
}

// Form data types
export interface RunSubmissionForm {
  boss: string;
  items: string[];
  hp: number;
  atk: number;
  def: number;
  spd: number;
  outcome: 'victory' | 'defeat';
  deathReason?: string;
  notes?: string;
  playerName?: string;
}

export interface CommentSubmissionForm {
  authorName?: string;
  message: string;
}

// Filter and sort options for the run feed
export interface RunFilters {
  boss?: string;
  outcome?: 'victory' | 'defeat';
}

export type RunSortOption = 'newest' | 'oldest' | 'funniest' | 'deadliest';

// API response types
export interface RunsResponse {
  runs: GameRun[];
  total: number;
  page: number;
  limit: number;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
}

// Share data for social media
export interface ShareData {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}
