import { useState, useEffect } from 'react';

export interface Comment {
  id: string;
  text: string;
  timestamp: number;
}

export function useComments(substituteId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load comments from localStorage on mount
  useEffect(() => {
    const storedComments = localStorage.getItem(`comments-${substituteId}`);
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    }
  }, [substituteId]);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`comments-${substituteId}`, JSON.stringify(comments));
  }, [comments, substituteId]);

  const addComment = (text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      text: text.trim(),
      timestamp: Date.now()
    };

    setComments(prev => [...prev, newComment]);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  const editComment = (commentId: string, newText: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, text: newText.trim(), timestamp: Date.now() }
          : comment
      )
    );
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return {
    comments,
    addComment,
    editComment,
    deleteComment,
    isSuccess
  };
}