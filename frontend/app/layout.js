import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-serif-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans-dm",
});

const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "https://agenceimmobiliere-laforet.online";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "LA FORÊT | Agence Immobilière de Prestige - Alger, Algérie",
    template: "%s | LA FORÊT - Immobilier de Prestige",
  },
  description:
    "LA FORÊT est l'agence immobilière de référence pour l'immobilier de luxe et de prestige à Alger (Hydra, El Biar, Ben Aknoun, Sidi Yahia). Vente, location, villas d'exception et estimation gratuite depuis 2002.",
  keywords: [
    "agence immobilière alger",
    "immobilier de luxe algérie",
    "agence immobilière prestige alger",
    "villa luxe hydra",
    "appartement prestige el biar",
    "estimation immobilière alger",
    "la forêt immobilier",
    "vente villa alger",
    "location appartement haut de gamme alger",
  ],
  authors: [{ name: "LA FORÊT Agence Immobilière", url: baseUrl }],
  creator: "LA FORÊT Agence Immobilière",
  publisher: "LA FORÊT Agence Immobilière",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "LA FORÊT | L'Excellence Immobilière en Algérie",
    description:
      "Découvrez notre sélection exclusive de biens d'exception à Alger (Hydra, El Biar, Ben Aknoun). Vente, location & estimation immobilière de prestige depuis 2002.",
    url: baseUrl,
    siteName: "LA FORÊT - Agence Immobilière",
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LA FORÊT | L'Excellence Immobilière en Algérie",
    description:
      "Agence immobilière de luxe & prestige à Alger. Villas, appartements d'exception et estimation gratuite depuis 2002.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "LA FORÊT - Agence Immobilière",
    url: baseUrl,
    logo: `${baseUrl}/icon`,
    image: `${baseUrl}/opengraph-image`,
    description:
      "Agence immobilière de référence pour l'immobilier de luxe et de prestige à Alger depuis 2002. Vente, location et estimation gratuite de villas et appartements d'exception.",
    telephone: "+213 550 59 37 07",
    email: "contact@laforet.dz",
    foundingDate: "2002",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Alger",
      addressRegion: "Alger",
      addressCountry: "DZ",
    },
    areaServed: [
      "Hydra",
      "El Biar",
      "Ben Aknoun",
      "Sidi Yahia",
      "Dely Ibrahim",
      "Alger Centre",
      "Chéraga",
      "Ouled Fayet",
    ],
    priceRange: "$$$$",
  };

  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans text-charcoal-900 antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
