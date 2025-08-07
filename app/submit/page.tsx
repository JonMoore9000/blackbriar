'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadGameData } from '@/data/gameData';
import { RunSubmissionForm, Boss, Item } from '@/types';
import { validateRunSubmission } from '@/lib/utils';

export default function SubmitRunPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemSearchTerm, setItemSearchTerm] = useState('');

  const [formData, setFormData] = useState<RunSubmissionForm>({
    boss: '',
    items: [],
    hp: 10,
    atk: 5,
    def: 3,
    spd: 2,
    outcome: 'defeat',
    deathReason: '',
    notes: '',
    playerName: ''
  });

  // Load game data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const gameData = await loadGameData();
        setBosses(gameData.bosses);
        setItems(gameData.items);
      } catch (error) {
        console.error('Failed to load game data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateRunSubmission(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors([]);
    
    try {
      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      router.push(`/runs/${result.id}`);
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit run. Please try again.';
      setErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleItemToggle = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.includes(itemId)
        ? prev.items.filter(id => id !== itemId)
        : [...prev.items, itemId]
    }));
  };

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    item.area?.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    item.type?.toLowerCase().includes(itemSearchTerm.toLowerCase()) ||
    item.rarity?.toLowerCase().includes(itemSearchTerm.toLowerCase())
  );

  return (
    <div className="submit-page min-h-screen">
      <div className="submit-container container mx-auto px-4 py-8">
        <div className="submit-content max-w-2xl mx-auto">
          <div className="submit-header mb-8">
            <Link
              href="/"
              className="submit-back-link font-body text-red-400 hover:text-red-300 transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="submit-title text-4xl font-bold text-red-500 mt-4 mb-2">
              Submit Your Run
            </h1>
            <p className="submit-description text-gray-300">
              Share your encounter with the darkness. Victory or defeat, all stories deserve to be told.
            </p>
          </div>

          {errors.length > 0 && (
            <div className="submit-errors bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
              <h3 className="submit-errors-title text-red-400 font-semibold mb-2">Please fix the following errors:</h3>
              <ul className="submit-errors-list list-disc list-inside text-red-300">
                {errors.map((error, index) => (
                  <li key={index} className="submit-error-item">{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="submit-form bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50">
            {/* Player Name */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Player Name (Optional)
              </label>
              <input
                type="text"
                value={formData.playerName}
                onChange={(e) => setFormData(prev => ({ ...prev, playerName: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                placeholder="Anonymous"
              />
            </div>

            {/* Boss Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Boss Encountered *
              </label>
              <select
                value={formData.boss}
                onChange={(e) => setFormData(prev => ({ ...prev, boss: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white text-lg focus:border-red-500 focus:outline-none"
                required
                disabled={loading}
              >
                <option value="">{loading ? 'Loading bosses...' : 'Select a boss...'}</option>
                {bosses.map(boss => (
                  <option key={boss.id} value={boss.id}>
                    {boss.name} ({boss.difficulty}) {boss.area && `- ${boss.area}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Items Selection */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Items Used *
              </label>
              {loading ? (
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 text-center">
                  <p className="text-gray-400">Loading items...</p>
                </div>
              ) : (
                <>
                  {/* Search Input */}
                  <div className="mb-3 relative">
                    <input
                      type="text"
                      placeholder="Search items by name, area, type, or rarity..."
                      value={itemSearchTerm}
                      onChange={(e) => setItemSearchTerm(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none text-sm"
                    />
                    {itemSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setItemSearchTerm('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        title="Clear search"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Items Grid */}
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto bg-gray-800 border border-gray-600 rounded-lg p-3">
                    {filteredItems.length > 0 ? (
                      filteredItems.map(item => (
                        <label key={item.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-700 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={formData.items.includes(item.id)}
                            onChange={() => handleItemToggle(item.id)}
                            className="text-red-500 focus:ring-red-500"
                          />
                          <div className="flex-1">
                            <span className="text-sm text-gray-300">{item.name}</span>
                            {item.area && (
                              <span className="text-xs text-gray-500 ml-1">({item.area})</span>
                            )}
                            {item.rarity && (
                              <span className={`text-xs ml-1 ${
                                item.rarity === 'common' ? 'text-gray-400' :
                                item.rarity === 'uncommon' ? 'text-green-400' :
                                item.rarity === 'rare' ? 'text-blue-400' :
                                item.rarity === 'heroic' ? 'text-orange-400' :
                                'text-purple-400'
                              }`}>
                                ★
                              </span>
                            )}
                          </div>
                        </label>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4">
                        <p className="text-gray-400 text-sm">
                          {itemSearchTerm ? 'No items found matching your search.' : 'No items available.'}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-400 mt-2">
                    Selected: {formData.items.length} items
                    {itemSearchTerm && (
                      <span className="ml-2">
                        • Showing {filteredItems.length} of {items.length} items
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Player Stats *
              </label>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">HP</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    value={formData.hp}
                    onChange={(e) => setFormData(prev => ({ ...prev, hp: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">ATK</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={formData.atk}
                    onChange={(e) => setFormData(prev => ({ ...prev, atk: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">DEF</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={formData.def}
                    onChange={(e) => setFormData(prev => ({ ...prev, def: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">SPD</label>
                  <input
                    type="number"
                    min="0"
                    max="999"
                    value={formData.spd}
                    onChange={(e) => setFormData(prev => ({ ...prev, spd: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Outcome */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Outcome *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="outcome"
                    value="victory"
                    checked={formData.outcome === 'victory'}
                    onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value as 'victory' | 'defeat' }))}
                    className="text-green-500 focus:ring-green-500"
                  />
                  <span className="text-green-400">Victory</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="outcome"
                    value="defeat"
                    checked={formData.outcome === 'defeat'}
                    onChange={(e) => setFormData(prev => ({ ...prev, outcome: e.target.value as 'victory' | 'defeat' }))}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <span className="text-red-400">Defeat</span>
                </label>
              </div>
            </div>

            {/* Death Reason (only for defeats) */}
            {formData.outcome === 'defeat' && (
              <div className="mb-6">
                <label className="block text-gray-300 font-semibold mb-2">
                  How did you die? *
                </label>
                <input
                  type="text"
                  value={formData.deathReason}
                  onChange={(e) => setFormData(prev => ({ ...prev, deathReason: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none"
                  placeholder="e.g., Overwhelmed by shadow minions"
                  required
                />
              </div>
            )}

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-gray-300 font-semibold mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:border-red-500 focus:outline-none h-24 resize-none"
                placeholder="Any additional details about your run..."
                maxLength={1000}
              />
              <p className="text-sm text-gray-400 mt-1">
                {formData.notes?.length || 0}/1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Run'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
