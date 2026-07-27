import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const alt = "LA FORÊT | L'Excellence Immobilière en Algérie";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0D2616 0%, #143A22 50%, #0A1C10 100%)',
          padding: '45px',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Sleek Minimalist Light Green/White Frame - Zero Gold */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            bottom: '24px',
            border: '2px solid rgba(255, 255, 255, 0.18)',
            borderRadius: '24px',
            display: 'flex',
          }}
        />

        {/* Top Header: Authentic Brand Identity */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '15px',
          }}
        >
          {/* Exact SVG Logo Emblem without text (Trees + House Roof) */}
          <svg
            width="140"
            height="90"
            viewBox="35 15 240 170"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#1A4A28"
              d="M 38 178 C 70 156, 130 144, 200 158 C 240 166, 260 174, 275 178 Z"
            />
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
            <path
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              d="M 154 108 L 191 77 L 272 126"
            />
            <g fill="#FFFFFF">
              <rect x="177" y="112" width="9" height="9" rx="1.5" />
              <rect x="190" y="112" width="9" height="9" rx="1.5" />
              <rect x="177" y="125" width="9" height="9" rx="1.5" />
              <rect x="190" y="125" width="9" height="9" rx="1.5" />
            </g>
          </svg>

          <div
            style={{
              fontSize: '34px',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '10px',
              marginTop: '6px',
            }}
          >
            LA FORÊT
          </div>
          <div
            style={{
              fontSize: '15px',
              color: '#86EFAC',
              letterSpacing: '6px',
              marginTop: '4px',
              textTransform: 'uppercase',
            }}
          >
            AGENCE IMMOBILIÈRE DE PRESTIGE • ALGER
          </div>
        </div>

        {/* Center Editorial Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            margin: 'auto 0',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              maxWidth: '960px',
            }}
          >
            L&apos;Excellence Immobilière
          </div>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 700,
              color: '#4ADE80',
              lineHeight: 1.15,
              letterSpacing: '-1px',
              fontStyle: 'italic',
              marginTop: '6px',
            }}
          >
            en Algérie
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#E2E8F0',
              marginTop: '24px',
              letterSpacing: '2px',
              fontWeight: 400,
            }}
          >
            VENTE • LOCATION • ESTIMATION DE BIENS D&apos;EXCEPTION
          </div>
        </div>

        {/* Bottom Footer Info Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '90%',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            paddingTop: '20px',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              color: '#A7F3D0',
              letterSpacing: '3px',
            }}
          >
            HYDRA • EL BIAR • BEN AKNOUN • ALGER
          </div>
          <div
            style={{
              fontSize: '17px',
              color: '#FFFFFF',
              fontWeight: 600,
              letterSpacing: '2px',
            }}
          >
            AGENCEIMMOBILIERE-LAFORET.ONLINE
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
