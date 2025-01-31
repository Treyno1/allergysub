import React from 'react';

interface PlaceholderProps {
  category: string;
  size?: number;
}

export default function Placeholder({ category, size = 300 }: PlaceholderProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: '#e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '0.5rem',
        color: '#64748b',
        fontFamily: 'system-ui',
        fontSize: size * 0.1,
        textAlign: 'center',
        padding: '1rem',
      }}
    >
      {category ? `${category}\nAlternative` : 'No Image'}
    </div>
  );
} 