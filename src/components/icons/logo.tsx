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
        <rect width="100" height="100" rx="20" fill="currentColor" />
      </g>
      <g className="text-primary-foreground">
        <path
          d="M30 75V25H55C67.5 25 75 32.5 75 45C75 57.5 67.5 65 55 65H45"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <line
          x1="50"
          y1="65"
          x2="70"
          y2="75"
          stroke="currentColor"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
