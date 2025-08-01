'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { GameRun, RunFilters, RunSortOption, Boss } from '@/types';
import { loadGameData } from '@/data/gameData';

import RunCard from '@/components/RunCard';

export default function RunsPage() {
  const [runs, setRuns] = useState<GameRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RunFilters>({});
  const [sortBy, setSortBy] = useState<RunSortOption>('newest');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [bossesLoading, setBossesLoading] = useState(true);

  const fetchRuns = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        sort: sortBy
      });
      
      if (filters.boss) params.append('boss', filters.boss);
      if (filters.outcome) params.append('outcome', filters.outcome);
      
      const response = await fetch(`/api/runs?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch runs');
      }
      
      const data = await response.json();
      
      if (reset) {
        setRuns(data.runs);
        setPage(2);
      } else {
        setRuns(prev => [...prev, ...data.runs]);
        setPage(prev => prev + 1);
      }
      
      setHasMore(data.runs.length === 20);
      setError(null);
    } catch {
      setError('Failed to load runs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, page]);

  useEffect(() => {
    fetchRuns(true);
  }, [fetchRuns, filters, sortBy]);

  // Load bosses for filter dropdown
  useEffect(() => {
    const loadBosses = async () => {
      try {
        const gameData = await loadGameData();
        setBosses(gameData.bosses);
      } catch (error) {
        console.error('Failed to load bosses:', error);
      } finally {
        setBossesLoading(false);
      }
    };

    loadBosses();
  }, []);

  const handleFilterChange = (newFilters: Partial<RunFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSortChange = (newSort: RunSortOption) => {
    setSortBy(newSort);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="runs-page min-h-screen">
      <div className="runs-container container mx-auto px-4 py-8">
        <div className="runs-content max-w-6xl mx-auto">
          {/* Header */}
          <div className="runs-header mb-8">
            <Link
              href="/"
              className="runs-back-link text-red-400 hover:text-red-300 transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="runs-title text-4xl font-bold text-red-500 mt-4 mb-2">
              All Runs
            </h1>
            <p className="runs-description text-gray-300">
              Browse through all the tales of triumph and tragedy in the depths of terror.
            </p>
          </div>

          {/* Filters and Sorting */}
          <div className="runs-filters bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50 mb-6">
            <div className="runs-filters-grid grid md:grid-cols-4 gap-4 mb-4">
              {/* Boss Filter */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2 text-sm">
                  Filter by Boss
                </label>
                <select
                  value={filters.boss || ''}
                  onChange={(e) => handleFilterChange({ boss: e.target.value || undefined })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none text-sm"
                  disabled={bossesLoading}
                >
                  <option value="">{bossesLoading ? 'Loading...' : 'All Bosses'}</option>
                  {bosses.map(boss => (
                    <option key={boss.id} value={boss.id}>
                      {boss.name} {boss.area && `(${boss.area})`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Outcome Filter */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2 text-sm">
                  Filter by Outcome
                </label>
                <select
                  value={filters.outcome || ''}
                  onChange={(e) => handleFilterChange({ outcome: e.target.value as 'victory' | 'defeat' | undefined })}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none text-sm"
                >
                  <option value="">All Outcomes</option>
                  <option value="victory">Victory</option>
                  <option value="defeat">Defeat</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-gray-300 font-semibold mb-2 text-sm">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as RunSortOption)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="funniest">Most Comments</option>
                  <option value="deadliest">Deadliest Runs</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(filters.boss || filters.outcome) && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400">Active filters:</span>
                {filters.boss && (
                  <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs">
                    Boss: {bosses.find(boss => boss.id === filters.boss)?.name || filters.boss}
                  </span>
                )}
                {filters.outcome && (
                  <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs">
                    Outcome: {filters.outcome}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-300">{error}</p>
              <button
                onClick={() => fetchRuns(true)}
                className="mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Runs Grid */}
          {runs.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No runs found</h3>
              <p className="text-gray-400 mb-6">
                {Object.keys(filters).length > 0 
                  ? 'Try adjusting your filters or be the first to submit a run with these criteria!'
                  : 'Be the first to submit a run and share your story!'
                }
              </p>
              <Link
                href="/submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Submit Your Run
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {runs.map((run) => (
                  <RunCard key={run.id} run={run} />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center">
                  <button
                    onClick={() => fetchRuns(false)}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More Runs'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
