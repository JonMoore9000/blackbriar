import { GameRun, Comment, RunFilters, RunSortOption } from '@/types';

// KV Storage implementation for Vercel
let kv: typeof import('@vercel/kv').kv | null = null;

// Initialize KV connection
async function getKV() {
  if (kv) return kv;
  
  try {
    // Only import @vercel/kv in production or when KV_URL is available
    if (process.env.KV_URL || process.env.VERCEL) {
      const { kv: vercelKV } = await import('@vercel/kv');
      kv = vercelKV;
      return kv;
    }
  } catch {
    console.log('KV not available, falling back to local storage');
  }
  
  return null;
}

// Fallback to local storage for development
async function fallbackToLocal() {
  const { saveRun: localSaveRun, getRuns: localGetRuns, getRunById: localGetRunById, 
          saveComment: localSaveComment, getCommentsByRunId: localGetCommentsByRunId,
          updateRunRoast: localUpdateRunRoast } = await import('./storage');
  
  return {
    saveRun: localSaveRun,
    getRuns: localGetRuns,
    getRunById: localGetRunById,
    saveComment: localSaveComment,
    getCommentsByRunId: localGetCommentsByRunId,
    updateRunRoast: localUpdateRunRoast
  };
}

// KV Storage functions
export async function saveRun(run: GameRun): Promise<void> {
  const kvClient = await getKV();
  
  if (!kvClient) {
    const local = await fallbackToLocal();
    return local.saveRun(run);
  }
  
  // Store individual run
  await kvClient.set(`run:${run.id}`, JSON.stringify(run));
  
  // Add to runs list
  const runsList: string[] = (await kvClient.get('runs:list') as string[]) || [];
  runsList.push(run.id);
  await kvClient.set('runs:list', runsList);
}

export async function getRuns(
  filters?: RunFilters,
  sortBy: RunSortOption = 'newest',
  page: number = 1,
  limit: number = 20
): Promise<{ runs: GameRun[]; total: number; page: number; limit: number }> {
  const kvClient = await getKV();
  
  if (!kvClient) {
    const local = await fallbackToLocal();
    return local.getRuns(filters, sortBy, page, limit);
  }
  
  // Get all run IDs
  const runIds: string[] = (await kvClient.get('runs:list') as string[]) || [];
  
  // Get all runs
  const runs: GameRun[] = [];
  for (const runId of runIds) {
    const runData = await kvClient.get(`run:${runId}`);
    if (runData) {
      runs.push(typeof runData === 'string' ? JSON.parse(runData) as GameRun : runData as GameRun);
    }
  }
  
  // Apply filters
  let filteredRuns = runs;
  if (filters?.boss) {
    filteredRuns = filteredRuns.filter(run => run.boss === filters.boss);
  }
  if (filters?.outcome) {
    filteredRuns = filteredRuns.filter(run => run.outcome === filters.outcome);
  }
  
  // Apply sorting
  filteredRuns.sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  // Apply pagination
  const total = filteredRuns.length;
  const startIndex = (page - 1) * limit;
  const paginatedRuns = filteredRuns.slice(startIndex, startIndex + limit);
  
  return {
    runs: paginatedRuns,
    total,
    page,
    limit
  };
}

export async function getRunById(id: string): Promise<GameRun | null> {
  const kvClient = await getKV();
  
  if (!kvClient) {
    const local = await fallbackToLocal();
    return local.getRunById(id);
  }
  
  const runData = await kvClient.get(`run:${id}`);
  if (!runData) return null;

  return typeof runData === 'string' ? JSON.parse(runData) as GameRun : runData as GameRun;
}

export async function updateRunRoast(runId: string, roast: string): Promise<void> {
  const kvClient = await getKV();
  
  if (!kvClient) {
    const local = await fallbackToLocal();
    return local.updateRunRoast(runId, roast);
  }
  
  const run = await getRunById(runId);
  if (run) {
    run.aiRoast = roast;
    await kvClient.set(`run:${runId}`, JSON.stringify(run));
  }
}

export async function saveComment(comment: Comment): Promise<void> {
  const kvClient = await getKV();
  
  if (!kvClient) {
    const local = await fallbackToLocal();
    return local.saveComment(comment);
  }
  
  // Store individual comment
  await kvClient.set(`comment:${comment.id}`, JSON.stringify(comment));
  
  // Add to run's comments list
  const runCommentsKey = `run:${comment.runId}:comments`;
  const commentsList: string[] = (await kvClient.get(runCommentsKey) as string[]) || [];
  commentsList.push(comment.id);
  await kvClient.set(runCommentsKey, commentsList);
  
  // Update run comment count
  const run = await getRunById(comment.runId);
  if (run) {
    run.commentCount = commentsList.length;
    await kvClient.set(`run:${comment.runId}`, JSON.stringify(run));
  }
}

export async function getCommentsByRunId(runId: string): Promise<Comment[]> {
  const kvClient = await getKV();
  
  if (!kvClient) {
    const local = await fallbackToLocal();
    return local.getCommentsByRunId(runId);
  }
  
  const commentIds: string[] = (await kvClient.get(`run:${runId}:comments`) as string[]) || [];
  
  const comments: Comment[] = [];
  for (const commentId of commentIds) {
    const commentData = await kvClient.get(`comment:${commentId}`);
    if (commentData) {
      comments.push(typeof commentData === 'string' ? JSON.parse(commentData) as Comment : commentData as Comment);
    }
  }
  
  // Sort by creation date (newest first)
  comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  return comments;
}
