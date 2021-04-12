import React from 'react';

export default function loaderComponent({ width = '60px', height = '50px', center = false }: { width?: string; height?: string; center?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: center ? 'center' : undefined,
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <path
          fill="none"
          stroke="#e90c59"
          strokeWidth="7"
          strokeDasharray="141.12391052246093 115.46501770019532"
          d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
          strokeLinecap="round"
        >
          <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.0204081632653061s" keyTimes="0;1" values="0;256.58892822265625"></animate>
        </path>
      </svg>
    </div>
  );
}
