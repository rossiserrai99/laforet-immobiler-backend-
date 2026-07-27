import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0D2616', // Luxury deep forest green
          borderRadius: '110px',
        }}
      >
        {/* Exact SVG Logo Emblem (Trees + House Roof + Window Grid) - No Text, No Gold */}
        <svg
          width="360"
          height="360"
          viewBox="35 15 240 170"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground rolling hill */}
          <path
            fill="#1A4A28"
            d="M 38 178 C 70 156, 130 144, 200 158 C 240 166, 260 174, 275 178 Z"
          />

          {/* Small Tree - Left */}
          <rect fill="#1E3826" x="63" y="152" width="5" height="24" rx="1" />
          <path
            fill="#34A853"
            d="M 65.5 100 C 58 112, 44 130, 40 148 L 91 148 C 87 130, 73 112, 65.5 100 Z"
          />
          <path
            fill="#4ADE80"
            d="M 65.5 70 C 59 80, 47 96, 44 112 L 87 112 C 84 96, 72 80, 65.5 70 Z"
          />
          <path
            fill="#86EFAC"
            d="M 65.5 42 C 61 51, 52 64, 50 76 L 81 76 C 79 64, 70 51, 65.5 42 Z"
          />

          {/* Tall Tree - Right */}
          <rect fill="#1E3826" x="117" y="142" width="7" height="36" rx="1" />
          <path
            fill="#1E7A3D"
            d="M 120.5 82 C 110 100, 88 132, 84 158 L 157 158 C 153 132, 131 100, 120.5 82 Z"
          />
          <path
            fill="#2E9E52"
            d="M 120.5 48 C 111 64, 94 92, 90 112 L 151 112 C 147 92, 130 64, 120.5 48 Z"
          />
          <path
            fill="#4ADE80"
            d="M 120.5 14 C 113 28, 100 52, 97 70 L 144 70 C 141 52, 128 28, 120.5 14 Z"
          />

          {/* House Roof - White */}
          <path
            stroke="#FFFFFF"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            d="M 154 108 L 191 77 L 272 126"
          />

          {/* Window Grid 2x2 - White */}
          <g fill="#FFFFFF">
            <rect x="177" y="112" width="9" height="9" rx="1.5" />
            <rect x="190" y="112" width="9" height="9" rx="1.5" />
            <rect x="177" y="125" width="9" height="9" rx="1.5" />
            <rect x="190" y="125" width="9" height="9" rx="1.5" />
          </g>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
