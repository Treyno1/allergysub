import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Rating } from '../types';

interface FeedbackSectionProps {
  substituteId: string;
  ratings: Rating[];
  onCommentSubmit: (comment: string) => void;
}

export default function FeedbackSection({
  substituteId,
  ratings,
  onCommentSubmit
}: FeedbackSectionProps) {
  const [comment, setComment] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onCommentSubmit(comment.trim());
      setComment('');
    }
  };

  // Get recent comments (last 3)
  const recentComments = ratings
    .filter(r => r.comment)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
        Community Feedback
      </h5>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this substitute..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500
              placeholder:text-gray-400 text-sm min-h-[80px] resize-none"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="absolute bottom-2 right-2 p-1.5 rounded-full
              bg-purple-500 text-white disabled:opacity-50
              disabled:cursor-not-allowed hover:bg-purple-600
              transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Recent Comments */}
      {recentComments.length > 0 && (
        <div className="space-y-3">
          {recentComments.map((rating, index) => (
            <div key={index} className="text-sm">
              <p className="text-gray-600">{rating.comment}</p>
              <p className="text-gray-400 text-xs mt-1">
                {new Date(rating.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}