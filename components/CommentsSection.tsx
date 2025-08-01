'use client';

import { useState } from 'react';
import { Comment, CommentSubmissionForm } from '@/types';
import { formatRelativeTime, validateComment } from '@/lib/utils';

interface CommentsSectionProps {
  runId: string;
  initialComments: Comment[];
}

export default function CommentsSection({ runId, initialComments }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<CommentSubmissionForm>({
    authorName: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateComment(formData.message, formData.authorName);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors([]);
    
    try {
      const response = await fetch(`/api/runs/${runId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }
      
      const result = await response.json();
      
      // Add the new comment to the list
      setComments(prev => [...prev, result.comment]);
      
      // Reset form
      setFormData({ authorName: '', message: '' });
      
    } catch {
      setErrors(['Failed to submit comment. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black/95 backdrop-blur-md rounded-lg p-6 border border-red-900/50">
      <h2 className="text-xl font-bold text-red-400 mb-6">
        Comments ({comments.length})
      </h2>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        {errors.length > 0 && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 mb-4">
            <ul className="list-disc list-inside text-red-300 text-sm">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <div className="sm:col-span-1">
            <label className="block text-gray-300 font-semibold mb-2 text-sm">
              Name (Optional)
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none text-sm"
              placeholder="Anonymous"
              maxLength={50}
            />
          </div>
          
          <div className="sm:col-span-2">
            <label className="block text-gray-300 font-semibold mb-2 text-sm">
              Comment *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-red-500 focus:outline-none text-sm h-20 resize-none"
              placeholder="Share your thoughts on this run..."
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !formData.message.trim()}
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          {isSubmitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-300 text-sm">
                  {comment.authorName || 'Anonymous'}
                </span>
                <span className="text-xs text-gray-400">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {comment.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
