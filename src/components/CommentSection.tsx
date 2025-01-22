import React, { useState } from 'react';
import { MessageSquare, Send, Edit2, Trash2, X, Check } from 'lucide-react';
import { useComments, Comment } from '../hooks/useComments';

interface CommentSectionProps {
  substituteId: string;
}

interface CommentItemProps {
  comment: Comment;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(comment.id, editText);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              text-sm resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleSave}
              disabled={!editText.trim()}
              className="p-1 text-blue-500 hover:text-blue-700
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">{comment.text}</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              {new Date(comment.timestamp).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1 text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CommentSection({ substituteId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { comments, addComment, editComment, deleteComment, isSuccess } = useComments(substituteId);

  const handleSubmit = () => {
    if (newComment.trim()) {
      addComment(newComment);
      setNewComment('');
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <MessageSquare className="w-4 h-4" />
        <h5 className="font-medium">Comments</h5>
      </div>

      {/* Comment input */}
      <div className="relative">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your experience with this substitute..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            placeholder:text-gray-400 text-sm min-h-[80px] resize-none pr-10"
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="absolute bottom-2 right-2 p-1.5 rounded-full
            bg-blue-500 text-white disabled:opacity-50
            disabled:cursor-not-allowed hover:bg-blue-600
            transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Success message */}
      {isSuccess && (
        <div className="text-sm text-emerald-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          Comment saved successfully!
        </div>
      )}

      {/* Comments list */}
      {comments.length > 0 && (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEdit={editComment}
              onDelete={deleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}