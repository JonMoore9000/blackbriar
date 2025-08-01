import { GameRun, Comment, RunFilters, RunSortOption } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

// File paths for data storage
const DATA_DIR = path.join(process.cwd(), 'data');
const RUNS_FILE = path.join(DATA_DIR, 'runs.json');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize empty data files if they don't exist
async function initializeDataFiles() {
  await ensureDataDir();
  
  try {
    await fs.access(RUNS_FILE);
  } catch {
    await fs.writeFile(RUNS_FILE, JSON.stringify([], null, 2));
  }
  
  try {
    await fs.access(COMMENTS_FILE);
  } catch {
    await fs.writeFile(COMMENTS_FILE, JSON.stringify([], null, 2));
  }
}

// Run storage functions
export async function saveRun(run: GameRun): Promise<void> {
  await initializeDataFiles();
  
  const runsData = await fs.readFile(RUNS_FILE, 'utf-8');
  const runs: GameRun[] = JSON.parse(runsData.replace(/^\uFEFF/, ''));
  
  runs.push(run);
  
  await fs.writeFile(RUNS_FILE, JSON.stringify(runs, null, 2));
}

export async function getRuns(
  filters?: RunFilters,
  sortBy: RunSortOption = 'newest',
  page: number = 1,
  limit: number = 20
): Promise<{ runs: GameRun[]; total: number }> {
  await initializeDataFiles();
  
  const runsData = await fs.readFile(RUNS_FILE, 'utf-8');
  // Remove BOM if present
  const cleanData = runsData.replace(/^\uFEFF/, '');
  let runs: GameRun[] = JSON.parse(cleanData);
  
  // Apply filters
  if (filters) {
    if (filters.boss) {
      runs = runs.filter(run => run.boss === filters.boss);
    }
    if (filters.outcome) {
      runs = runs.filter(run => run.outcome === filters.outcome);
    }
  }
  
  // Apply sorting
  runs.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'funniest':
        // Sort by comment count as proxy for funniest
        return b.commentCount - a.commentCount;
      case 'deadliest':
        // Sort defeats first, then by lowest total stats
        if (a.outcome !== b.outcome) {
          return a.outcome === 'defeat' ? -1 : 1;
        }
        const aTotalStats = a.hp + a.atk + a.def + a.spd;
        const bTotalStats = b.hp + b.atk + b.def + b.spd;
        return aTotalStats - bTotalStats;
      default:
        return 0;
    }
  });
  
  const total = runs.length;
  const startIndex = (page - 1) * limit;
  const paginatedRuns = runs.slice(startIndex, startIndex + limit);
  
  return { runs: paginatedRuns, total };
}

export async function getRunById(id: string): Promise<GameRun | null> {
  await initializeDataFiles();
  
  const runsData = await fs.readFile(RUNS_FILE, 'utf-8');
  const runs: GameRun[] = JSON.parse(runsData.replace(/^\uFEFF/, ''));
  
  return runs.find(run => run.id === id) || null;
}

// Comment storage functions
export async function saveComment(comment: Comment): Promise<void> {
  await initializeDataFiles();
  
  const commentsData = await fs.readFile(COMMENTS_FILE, 'utf-8');
  const comments: Comment[] = JSON.parse(commentsData);
  
  comments.push(comment);
  
  await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  
  // Update comment count on the run
  await updateRunCommentCount(comment.runId);
}

export async function getCommentsByRunId(runId: string): Promise<Comment[]> {
  await initializeDataFiles();
  
  const commentsData = await fs.readFile(COMMENTS_FILE, 'utf-8');
  const comments: Comment[] = JSON.parse(commentsData);
  
  return comments
    .filter(comment => comment.runId === runId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

// Helper function to update comment count
async function updateRunCommentCount(runId: string): Promise<void> {
  const runsData = await fs.readFile(RUNS_FILE, 'utf-8');
  const runs: GameRun[] = JSON.parse(runsData.replace(/^\uFEFF/, ''));
  
  const runIndex = runs.findIndex(run => run.id === runId);
  if (runIndex !== -1) {
    const comments = await getCommentsByRunId(runId);
    runs[runIndex].commentCount = comments.length;
    
    await fs.writeFile(RUNS_FILE, JSON.stringify(runs, null, 2));
  }
}

// Update run with AI roast
export async function updateRunRoast(runId: string, roast: string): Promise<void> {
  await initializeDataFiles();

  const runsData = await fs.readFile(RUNS_FILE, 'utf-8');
  const runs: GameRun[] = JSON.parse(runsData.replace(/^\uFEFF/, ''));

  const runIndex = runs.findIndex(run => run.id === runId);
  if (runIndex !== -1) {
    runs[runIndex].aiRoast = roast;
    await fs.writeFile(RUNS_FILE, JSON.stringify(runs, null, 2));
  }
}

// Utility function to generate unique IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
