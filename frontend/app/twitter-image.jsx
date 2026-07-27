import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
export const alt = "LA FORÊT | L'Excellence Immobilière en Algérie";

export default function TwitterImage() {
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
          background: 'linear-gradient(135deg, #0D2213 0%, #173820 50%, #0A1C10 100%)',
          padding: '50px',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Luxury Gold Border Frame */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            right: '24px',
            bottom: '24px',
            border: '2px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '24px',
            display: 'flex',
          }}
        />

        {/* Top Header: Brand Identity */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '20px',
          }}
        >
          {/* Gold Pine Tree SVG */}
          <svg
            width="76"
            height="76"
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
              fontSize: '32px',
              fontWeight: 700,
              color: '#FBF7E9',
              letterSpacing: '10px',
              marginTop: '10px',
            }}
          >
            LA FORÊT
          </div>
          <div
            style={{
              fontSize: '15px',
              color: '#D4AF37',
              letterSpacing: '6px',
              marginTop: '4px',
              textTransform: 'uppercase',
            }}
          >
            AGENCE IMMOBILIÈRE DE PRESTIGE • DEPUIS 2002
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
              color: '#FBF7E9',
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
              color: '#D4AF37',
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
              color: '#E6EFE1',
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
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            paddingTop: '20px',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              color: '#D1E1CA',
              letterSpacing: '3px',
            }}
          >
            HYDRA • EL BIAR • BEN AKNOUN • ALGER
          </div>
          <div
            style={{
              fontSize: '17px',
              color: '#FBF7E9',
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
