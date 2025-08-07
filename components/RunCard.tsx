'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GameRun, Boss } from '@/types';
import { getBossById } from '@/data/gameData';
import { formatRelativeTime, calculateTotalStats, truncateText } from '@/lib/utils';
import BossImage from '@/components/BossImage';

interface RunCardProps {
  run: GameRun;
}

export default function RunCard({ run }: RunCardProps) {
  const [boss, setBoss] = useState<Boss | undefined>(undefined);
  const totalStats = calculateTotalStats(run);
  const itemCount = run.items.length;

  useEffect(() => {
    const loadBoss = async () => {
      const bossData = await getBossById(run.boss);
      setBoss(bossData);
    };

    loadBoss();
  }, [run.boss]);
  
  return (
    <Link href={`/runs/${run.id}`} className="run-card-link">
      <div className="run-card bg-black/95 backdrop-blur-md rounded-lg p-4 border border-red-900/50 hover:border-red-500/50 transition-all duration-200 hover:bg-black/99 cursor-pointer h-full">
        {/* Header */}
        <div className="run-card-header flex items-center justify-between mb-3">
          <div className="run-card-boss-info flex items-center space-x-3">
            <BossImage
              imageUrl={boss?.imageUrl}
              name={boss?.name || run.boss}
              className="w-8 h-8"
            />
            <span className="run-card-boss-name font-semibold text-white text-sm">
              {boss?.name || run.boss}
            </span>
          </div>

          {/* Outcome Badge */}
          <div className={`run-card-outcome-badge inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
            run.outcome === 'victory'
              ? 'bg-green-900/50 text-green-400'
              : 'bg-red-900/50 text-red-400'
          }`}>
            <span className="run-card-outcome-icon">{run.outcome === 'victory' ? '👑' : '💀'}</span>
          </div>
        </div>

        {/* Player Info */}
        <div className="run-card-player-info mb-3">
          <p className="run-card-player-name text-gray-300 font-medium text-sm">
            {run.playerName || 'Anonymous'}
          </p>
          <p className="run-card-timestamp text-gray-400 text-xs">
            {formatRelativeTime(run.createdAt)}
          </p>
        </div>

        {/* Stats Summary */}
        <div className="run-card-stats grid grid-cols-4 gap-2 mb-3">
          <div className="run-card-stat-hp text-center">
            <div className="run-card-stat-label text-red-400 text-xs font-semibold">HP</div>
            <div className="run-card-stat-value text-white text-sm">{run.hp}</div>
          </div>
          <div className="run-card-stat-atk text-center">
            <div className="run-card-stat-label text-orange-400 text-xs font-semibold">ATK</div>
            <div className="run-card-stat-value text-white text-sm">{run.atk}</div>
          </div>
          <div className="run-card-stat-def text-center">
            <div className="run-card-stat-label text-blue-400 text-xs font-semibold">DEF</div>
            <div className="run-card-stat-value text-white text-sm">{run.def}</div>
          </div>
          <div className="run-card-stat-spd text-center">
            <div className="run-card-stat-label text-green-400 text-xs font-semibold">SPD</div>
            <div className="run-card-stat-value text-white text-sm">{run.spd}</div>
          </div>
        </div>

        {/* Total Stats */}
        <div className="run-card-total-stats text-center mb-3 py-2 bg-gray-800/50 rounded">
          <span className="run-card-total-stats-label text-xs text-gray-400">Total Stats: </span>
          <span className="run-card-total-stats-value text-white font-semibold">{totalStats}</span>
        </div>

        {/* Items Count */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-400">Items Used:</span>
          <span className="text-white text-sm font-semibold">{itemCount}</span>
        </div>

        {/* Death Reason (for defeats) */}
        {run.outcome === 'defeat' && run.deathReason && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">Cause of Death:</p>
            <p className="text-red-300 text-xs italic">
              &ldquo;{truncateText(run.deathReason, 60)}&rdquo;
            </p>
          </div>
        )}

        {/* Notes Preview */}
        {run.notes && (
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-1">Notes:</p>
            <p className="text-gray-300 text-xs">
              {truncateText(run.notes, 80)}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            <span>💬 {run.commentCount}</span>
            {boss?.difficulty && (
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                boss.difficulty === 'easy' ? 'bg-green-900/50 text-green-400' :
                boss.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' :
                boss.difficulty === 'hard' ? 'bg-orange-900/50 text-orange-400' :
                'bg-purple-900/50 text-purple-400'
              }`}>
                {boss.difficulty.toUpperCase()}
              </span>
            )}
          </div>
          
          <span className="text-xs text-red-400 hover:text-red-300">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
