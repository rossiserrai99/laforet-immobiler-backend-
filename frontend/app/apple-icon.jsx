import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #1E4D2B 0%, #112C18 100%)',
          borderRadius: '40px',
          border: '6px solid rgba(212, 175, 55, 0.85)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '-4px',
          }}
        >
          <svg
            width="100"
            height="100"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 60 12 C 55 22, 45 34, 40 44 L 80 44 C 75 34, 65 22, 60 12 Z"
              fill="#E8C97A"
            />
            <path
              d="M 60 30 C 52 42, 38 58, 32 72 L 88 72 C 82 58, 68 42, 60 30 Z"
              fill="#D4AF37"
            />
            <path
              d="M 60 52 C 48 66, 30 86, 22 100 L 98 100 C 90 86, 72 66, 60 52 Z"
              fill="#C9A227"
            />
            <rect x="54" y="100" width="12" height="14" fill="#96780C" rx="2" />
          </svg>
          <div
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#FBF7E9',
              letterSpacing: '3px',
              marginTop: '2px',
            }}
          >
            LF
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
