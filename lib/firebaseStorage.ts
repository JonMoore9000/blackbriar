import { collection, doc, getDoc, getDocs, limit as fsLimit, orderBy, query, setDoc, where, QueryConstraint } from 'firebase/firestore';
import { getDb } from './firebase';
import { GameRun, Comment, RunFilters, RunSortOption } from '@/types';

// Local fallback
async function local() {
  const { saveRun, getRuns, getRunById, saveComment, getCommentsByRunId, updateRunRoast } = await import('./storage');
  return { saveRun, getRuns, getRunById, saveComment, getCommentsByRunId, updateRunRoast };
}

// Collection names
const RUNS = 'runs';
const COMMENTS = 'comments';

export async function saveRun(run: GameRun): Promise<void> {
  try {
    const db = getDb();
    await setDoc(doc(db, RUNS, run.id), run);
  } catch {
    const l = await local();
    return l.saveRun(run);
  }
}

export async function getRunById(id: string): Promise<GameRun | null> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, RUNS, id));
    return snap.exists() ? (snap.data() as GameRun) : null;
  } catch {
    const l = await local();
    return l.getRunById(id);
  }
}

export async function updateRunRoast(runId: string, roast: string): Promise<void> {
  try {
    const db = getDb();
    const snap = await getDoc(doc(db, RUNS, runId));
    if (!snap.exists()) return;
    const run = snap.data() as GameRun;
    run.aiRoast = roast;
    await setDoc(doc(db, RUNS, runId), run);
  } catch {
    const l = await local();
    return l.updateRunRoast(runId, roast);
  }
}

export async function getRuns(
  filters?: RunFilters,
  sortBy: RunSortOption = 'newest',
  page: number = 1,
  limit: number = 20,
): Promise<{ runs: GameRun[]; total: number; page: number; limit: number }> {
  try {
    const db = getDb();

    // Build base query with filters
    const constraints: QueryConstraint[] = [];
    if (filters?.boss) constraints.push(where('boss', '==', filters.boss));
    if (filters?.outcome) constraints.push(where('outcome', '==', filters.outcome));

    // Sorting
    switch (sortBy) {
      case 'oldest':
        constraints.push(orderBy('createdAt', 'asc'));
        break;
      case 'newest':
      default:
        constraints.push(orderBy('createdAt', 'desc'));
        break;
    }

    // Pagination (simple offset pagination by fetching first N*page and slicing)
    const q = query(collection(db, RUNS), ...constraints, fsLimit(limit * page));
    const snaps = await getDocs(q);
    const all = snaps.docs.map(d => d.data() as GameRun);

    // Total count (naive)
    const totalQuery = query(collection(db, RUNS), ...constraints);
    const totalSnaps = await getDocs(totalQuery);
    const total = totalSnaps.size;

    const startIndex = (page - 1) * limit;
    const runs = all.slice(startIndex, startIndex + limit);

    return { runs, total, page, limit };
  } catch {
    const l = await local();
    return l.getRuns(filters, sortBy, page, limit);
  }
}

export async function saveComment(comment: Comment): Promise<void> {
  try {
    const db = getDb();
    await setDoc(doc(db, COMMENTS, comment.id), comment);

    // Increment comment count on the run document
    const runSnap = await getDoc(doc(db, RUNS, comment.runId));
    if (runSnap.exists()) {
      const run = runSnap.data() as GameRun;
      run.commentCount = (run.commentCount || 0) + 1;
      await setDoc(doc(db, RUNS, comment.runId), run);
    }
  } catch {
    const l = await local();
    return l.saveComment(comment);
  }
}

export async function getCommentsByRunId(runId: string): Promise<Comment[]> {
  try {
    const db = getDb();
    const q = query(collection(db, COMMENTS), where('runId', '==', runId), orderBy('createdAt', 'asc'));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => d.data() as Comment);
  } catch {
    const l = await local();
    return l.getCommentsByRunId(runId);
  }
}

