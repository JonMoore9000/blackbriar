'use client';

import { useState } from 'react';
import { GameRun } from '@/types';
import { createTwitterShareUrl, createDiscordShareText } from '@/lib/utils';

interface ShareButtonsProps {
  run: GameRun;
}

export default function ShareButtons({ run }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const runUrl = `${baseUrl}/runs/${run.id}`;
  const twitterUrl = createTwitterShareUrl(run, baseUrl);
  const discordText = createDiscordShareText(run, baseUrl);
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };
  
  const copyUrl = () => copyToClipboard(runUrl);
  const copyDiscordText = () => copyToClipboard(discordText);
  
  return (
    <div className="bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50 mb-6">
      <h2 className="text-xl font-bold text-red-400 mb-4">Share This Run</h2>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Twitter Share */}
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <span>🐦</span>
          <span>Twitter</span>
        </a>
        
        {/* Discord Copy */}
        <button
          onClick={copyDiscordText}
          className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <span>💬</span>
          <span>Discord</span>
        </button>
        
        {/* Copy URL */}
        <button
          onClick={copyUrl}
          className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          <span>🔗</span>
          <span>Copy Link</span>
        </button>
        
        {/* Copy Status */}
        <div className="flex items-center justify-center">
          {copied && (
            <span className="text-green-400 font-semibold animate-pulse">
              ✅ Copied!
            </span>
          )}
        </div>
      </div>
      
      {/* URL Display */}
      <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
        <p className="text-sm text-gray-400 mb-1">Direct Link:</p>
        <code className="text-xs text-gray-300 break-all">{runUrl}</code>
      </div>
    </div>
  );
}
