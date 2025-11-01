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
      aria-label="ExecuDash Logo"
    >
      <rect width="100" height="100" rx="20" fill="hsl(var(--primary))"/>
      <path d="M30 70V30L50 40L70 30V70L50 60L30 70Z" stroke="hsl(var(--primary-foreground))" strokeWidth="8" strokeLinejoin="round"/>
    </svg>
  );
}
