'use client';

import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSubtitle = true }) => {
  const dimensions = {
    sm: { imgWidth: 120, imgHeight: 40, iconSize: 36 },
    md: { imgWidth: 160, imgHeight: 52, iconSize: 46 },
    lg: { imgWidth: 220, imgHeight: 70, iconSize: 58 },
    hero: { imgWidth: 300, imgHeight: 96, iconSize: 76 }
  }[size];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <img
        src="/images/logo.png"
        alt="American | Premium Fast Food"
        style={{
          height: `${dimensions.imgHeight}px`,
          width: 'auto',
          maxWidth: `${dimensions.imgWidth}px`,
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
        }}
        onError={(e) => {
          // Fallback if image fails
          (e.target as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
};
