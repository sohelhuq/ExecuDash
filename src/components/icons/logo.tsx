import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="FinanSage AI Logo"
    >
      <rect width="100" height="100" rx="20" fill="hsl(var(--primary))"/>
      <path d="M30 70L30 55C30 46.7157 36.7157 40 45 40L55 40C63.2843 40 70 46.7157 70 55L70 70" stroke="hsl(var(--primary-foreground))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M50 70V30" stroke="hsl(var(--primary-foreground))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M35 30H65" stroke="hsl(var(--primary-foreground))" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
