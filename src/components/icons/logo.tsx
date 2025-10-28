import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ExecuDash Logo"
    >
      <g className="text-primary">
        <rect width="100" height="100" rx="0" fill="currentColor" />
        <path
          d="M 50,15 L 85,50 L 50,85 L 15,50 Z"
          strokeWidth="10"
          stroke="hsl(var(--primary-foreground))"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
