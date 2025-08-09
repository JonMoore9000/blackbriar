import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getRunById, getCommentsByRunId } from '@/lib/firebaseStorage';
import { getBossById, getItemById } from '@/lib/serverGameData';
import { formatRelativeTime, calculateTotalStats } from '@/lib/utils';
import RunStats from '@/components/RunStats';
import ItemList from '@/components/ItemList';
import CommentsSection from '@/components/CommentsSection';
import ShareButtons from '@/components/ShareButtons';
import AIRoastSection from '@/components/AIRoastSection';
import BossImage from '@/components/BossImage';

interface RunPageProps {
  params: Promise<{ id: string }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { id } = await params;
  const run = await getRunById(id);
  
  if (!run) {
    notFound();
  }
  
  const boss = await getBossById(run.boss);
  const items = await Promise.all(
    run.items.map(async itemId => await getItemById(itemId))
  ).then(items => items.filter(Boolean));
  const comments = await getCommentsByRunId(run.id);
  const totalStats = calculateTotalStats(run);
  
  return (
    <div className="run-page min-h-screen">
      <div className="run-page-container container mx-auto px-4 py-8">
        <div className="run-page-content max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="run-page-nav mb-8">
            <Link
              href="/runs"
              className="run-page-back-link text-red-400 hover:text-red-300 transition-colors"
            >
              ← Back to All Runs
            </Link>
          </div>

          {/* Run Header */}
          <div className="run-header bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50 mb-6">
            <div className="run-header-main flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="run-header-info">
                <h1 className="run-title text-3xl font-bold text-white mb-2">
                  {run.playerName || 'Anonymous'} vs {boss?.name || run.boss}
                </h1>
                <div className="run-meta flex items-center space-x-4 text-gray-400">
                  <span className="run-timestamp">{formatRelativeTime(run.createdAt)}</span>
                  <span className="run-meta-separator">•</span>
                  <span className="run-comment-count">{comments.length} comments</span>
                </div>
              </div>

              {/* Outcome Badge */}
              <div className={`run-outcome-badge inline-flex items-center px-4 py-2 rounded-full font-semibold ${
                run.outcome === 'victory'
                  ? 'bg-green-900/50 text-green-400 border border-green-500/50'
                  : 'bg-red-900/50 text-red-400 border border-red-500/50'
              }`}>
                <span className="run-outcome-text">{run.outcome === 'victory' ? '👑 Victory' : '💀 Defeat'}</span>
              </div>
            </div>

            {/* Death Reason */}
            {run.outcome === 'defeat' && run.deathReason && (
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-4">
                <h3 className="text-red-400 font-semibold mb-1">Cause of Death:</h3>
                <p className="text-gray-300">{run.deathReason}</p>
              </div>
            )}

            {/* Notes */}
            {run.notes && (
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4">
                <h3 className="text-gray-400 font-semibold mb-1">Notes:</h3>
                <p className="text-gray-300">{run.notes}</p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Boss Card */}
            <div className="bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50">
              <h2 className="text-xl font-bold text-red-400 mb-4">Boss Encountered</h2>
              <div className="text-center">
                <BossImage
                  imageUrl={boss?.imageUrl}
                  name={boss?.name || run.boss}
                  className="w-24 h-24"
                />
                <h3 className="text-lg font-semibold text-white mb-1">
                  {boss?.name || run.boss}
                </h3>
                {boss?.description && (
                  <p className="text-sm text-gray-400 mb-2">{boss.description}</p>
                )}
                {boss?.difficulty && (
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    boss.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' :
                    boss.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                    boss.difficulty === 'hard' ? 'bg-orange-900/50 text-orange-400' :
                    'bg-purple-900/50 text-purple-400'
                  }`}>
                    {boss.difficulty.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Player Stats */}
            <div className="bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50">
              <h2 className="text-xl font-bold text-red-400 mb-4">Player Stats</h2>
              <RunStats run={run} />
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <span className="text-sm text-gray-400">Total Stats</span>
                  <div className="text-2xl font-bold text-white">{totalStats}</div>
                </div>
              </div>
            </div>

            {/* Items Used */}
            <div className="run-item-list bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50">
              <h2 className="text-xl font-bold text-red-400 mb-4">Items Used</h2>
              <ItemList items={items} />
            </div>    
          </div>

          {/* AI Roast Section */}
          <AIRoastSection run={run} />

          {/* Share Buttons */}
          <ShareButtons run={run} />

          {/* Comments Section */}
          <CommentsSection runId={run.id} initialComments={comments} />
        </div>
      </div>
    </div>
  );
}

// Generate metadata for better SEO and social sharing
export async function generateMetadata({ params }: RunPageProps) {
  const { id } = await params;
  const run = await getRunById(id);

  if (!run) {
    return {
      title: 'Run Not Found',
    };
  }

  const boss = await getBossById(run.boss);
  const playerName = run.playerName || 'Anonymous';
  const outcome = run.outcome === 'victory' ? 'defeated' : 'was slain by';
  
  return {
    title: `${playerName} ${outcome} ${boss?.name || run.boss} | We Are Losing`,
    description: run.notes || `${playerName} ${outcome} ${boss?.name || run.boss} with stats: HP: ${run.hp}, ATK: ${run.atk}, DEF: ${run.def}, SPD: ${run.spd}`,
    openGraph: {
      title: `${playerName} ${outcome} ${boss?.name || run.boss}`,
      description: run.notes || `Stats: HP: ${run.hp}, ATK: ${run.atk}, DEF: ${run.def}, SPD: ${run.spd}`,
      type: 'article',
      publishedTime: run.createdAt,
    },
    twitter: {
      card: 'summary',
      title: `${playerName} ${outcome} ${boss?.name || run.boss}`,
      description: run.notes || `Stats: HP: ${run.hp}, ATK: ${run.atk}, DEF: ${run.def}, SPD: ${run.spd}`,
    },
  };
}
