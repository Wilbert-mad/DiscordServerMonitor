import React from 'react';

export default function Arrow({ className }: { className?: string }) {
  return (
    <svg className={'cursor-pointer ' + className} width="615" height="1065" viewBox="0 0 615 1065" fill="none" xmlns="http://www.w3.org/2000/svg">
      {' '}
      <g filter="url(#filter0_d)">
        {' '}
        <path
          d="M90.6194 3.76989L7.32672 94.0304C3.76377 97.8914 3.79615 103.851 7.40082 107.673L397.879 521.703C401.488 525.529 401.515 531.497 397.942 535.357L7.80143 956.834C4.04647 960.891 4.29494 967.224 8.35615 970.974L98.628 1054.33C102.639 1058.03 108.878 1057.83 112.646 1053.88L607.36 535.458C611.068 531.572 611.044 525.451 607.305 521.594L105.148 3.59121C101.152 -0.531191 94.5131 -0.449542 90.6194 3.76989Z"
          fill="black"
        />{' '}
      </g>{' '}
      <defs>
        {' '}
        <filter id="filter0_d" x="0.675762" y="0.551605" width="613.45" height="1064.43" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          {' '}
          <feFlood flood-opacity="0" result="BackgroundImageFix" /> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />{' '}
          <feOffset dy="4" /> <feGaussianBlur stdDeviation="2" /> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />{' '}
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" /> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />{' '}
        </filter>{' '}
      </defs>{' '}
    </svg>
  );
}
