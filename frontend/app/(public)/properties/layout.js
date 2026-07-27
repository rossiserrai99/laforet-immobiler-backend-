import React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://agenceimmobiliere-laforet.online';

export const metadata = {
  title: "Catalogue de Biens de Prestige - Hydra, El Biar, Alger",
  description: "Explorez notre catalogue de villas de luxe, appartements d'exception, duplex et terrains de prestige à Alger. Achat, location et vente avec LA FORÊT - Agence Immobilière.",
  openGraph: {
    title: "Catalogue Immobilier de Luxe | LA FORÊT - Alger",
    description: "Villas, appartements & biens d'exception à Hydra, El Biar, Ben Aknoun et Alger Centre. Trouvez le bien de vos rêves.",
    url: `${baseUrl}/properties`,
    siteName: "LA FORÊT - Agence Immobilière",
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Catalogue Immobilier de Luxe | LA FORÊT - Alger",
    description: "Villas, appartements & biens d'exception à Hydra, El Biar, Ben Aknoun et Alger Centre.",
  },
};

export default function PropertiesLayout({ children }) {
  return <>{children}</>;
}
