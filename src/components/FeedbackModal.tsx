import React, { useState } from 'react';
import { X, MessageSquare } from 'lucide-react';
import StarRating from './StarRating';

interface FeedbackModalProps {
  substituteName: string;
  onClose: () => void;
  onSubmit: (feedback: FeedbackData) => void;
}

export interface FeedbackData {
  rating: number;
  comment: string;
  email?: string;
}

export default function FeedbackModal({ 
  substituteName, 
  onClose, 
  onSubmit 
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ rating, comment, email });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {submitted ? 'Thank You!' : `Rate ${substituteName}`}
              </h3>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {submitted ? (
            <div className="text-center py-6">
              <p className="text-lg text-gray-900 font-medium mb-2">
                Your feedback has been submitted!
              </p>
              <p className="text-gray-600">
                Thank you for helping us improve AllergySwap.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How would you rate this substitute?
                </label>
                <StarRating
                  rating={rating}
                  onRate={setRating}
                  size="lg"
                />
              </div>

              {/* Comment */}
              <div>
                <label 
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Share your experience (optional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How did this substitute work for you?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    placeholder:text-gray-400 min-h-[100px]"
                />
              </div>

              {/* Email */}
              <div>
                <label 
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    placeholder:text-gray-400"
                />
                <p className="mt-1 text-xs text-gray-500">
                  We'll only use this to follow up on your feedback if needed.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={rating === 0}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 transition-colors disabled:opacity-50
                  disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}