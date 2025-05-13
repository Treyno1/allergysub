import React, { useState, useEffect } from 'react';

interface AdminAuthProps {
  children: React.ReactNode;
  onAuthStatusChange?: (isAuthenticated: boolean) => void;
}

export default function AdminAuth({ children, onAuthStatusChange }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Always authenticated by default

  // Call the callback on mount to update parent component state
  useEffect(() => {
    if (onAuthStatusChange) {
      onAuthStatusChange(true);
    }
  }, [onAuthStatusChange]);

  const handleLogout = () => {
    // Hide the admin panel and also remove from localStorage to hide the button
    localStorage.removeItem('showAdminButton');
    
    if (onAuthStatusChange) {
      onAuthStatusChange(false);
    }
    
    // Redirect to main page
    window.location.href = '/';
  };

  // Always render children without authentication
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Exit Admin Panel
        </button>
      </div>
      {children}
    </div>
  );
} 