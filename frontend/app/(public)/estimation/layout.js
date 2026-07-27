import React from 'react';

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://agenceimmobiliere-laforet.online';

export const metadata = {
  title: "Estimation Immobilière Gratuite & Confidentielle - Alger",
  description: "Faites estimer la valeur réelle de votre villa, appartement ou terrain de prestige à Alger par les experts LA FORÊT. Estimation rapide, précise et 100% confidentielle.",
  openGraph: {
    title: "Estimation Immobilière Gratuite & Confidentielle | LA FORÊT - Alger",
    description: "Estimez votre bien d'exception à Hydra, El Biar, Ben Aknoun et Alger avec nos experts immobiliers depuis 2002.",
    url: `${baseUrl}/estimation`,
    siteName: "LA FORÊT - Agence Immobilière",
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Estimation Immobilière de Prestige | LA FORÊT - Alger",
    description: "Estimez la valeur réelle de votre bien d'exception à Alger. Confidentiel & gratuit.",
  },
};

export default function EstimationLayout({ children }) {
  return <>{children}</>;
}
