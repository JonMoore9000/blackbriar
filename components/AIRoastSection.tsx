'use client';

import { useState } from 'react';
import { GameRun } from '@/types';

interface AIRoastSectionProps {
  run: GameRun;
}

export default function AIRoastSection({ run }: AIRoastSectionProps) {
  const [roast, setRoast] = useState(run.aiRoast);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateRoast = async (regenerate = false) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`/api/runs/${run.id}/roast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ regenerate }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate roast');
      }
      
      const data = await response.json();
      setRoast(data.roast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate roast');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-roast-section bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50 mb-6">
      <h2 className="ai-roast-title text-xl font-bold text-red-400 mb-4">🤖 AI Roast</h2>

      {error && (
        <div className="ai-roast-error bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4">
          <p className="ai-roast-error-text text-red-300 text-sm">{error}</p>
        </div>
      )}

      {roast ? (
        <div className="ai-roast-content bg-gray-800/50 border border-gray-600/50 rounded-lg p-4 mb-4">
          <p className="ai-roast-text text-gray-300 italic text-lg">&ldquo;{roast}&rdquo;</p>
        </div>
      ) : (
        <div className="ai-roast-placeholder bg-gray-800/50 border border-gray-600/50 rounded-lg p-4 text-center mb-4">
          <p className="ai-roast-placeholder-title text-gray-400">🔥 No AI roast yet 🔥</p>
          <p className="ai-roast-placeholder-text text-sm text-gray-500 mt-1">
            Click the button below to get a devastating AI commentary on this run!
          </p>
        </div>
      )}
      
      {!roast && (
        <div className="ai-roast-generate-container text-center">
          <button
            onClick={() => generateRoast(false)}
            disabled={isGenerating}
            className="ai-roast-generate-btn bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <span className="ai-roast-loading-icon animate-spin inline-block mr-2">🔥</span>
                <span className="ai-roast-loading-text">Generating Roast...</span>
              </>
            ) : (
              <>
                <span className="ai-roast-generate-text">🤖 Generate AI Roast</span>
              </>
            )}
          </button>
        </div>
      )}

      {roast && (
        <div className="ai-roast-regenerate-container text-center">
          <button
            onClick={() => generateRoast(true)}
            disabled={isGenerating}
            className="ai-roast-regenerate-btn bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            {isGenerating ? (
              <>
                <span className="ai-roast-loading-icon animate-spin inline-block mr-2">🔥</span>
                <span className="ai-roast-loading-text">Generating New Roast...</span>
              </>
            ) : (
              <>
                <span className="ai-roast-regenerate-text">🔄 Generate New Roast</span>
              </>
            )}
          </button>
          <p className="ai-roast-regenerate-hint text-xs text-gray-500 mt-2">
            Not satisfied with this roast? Generate a new one!
          </p>
        </div>
      )}
    </div>
  );
}
