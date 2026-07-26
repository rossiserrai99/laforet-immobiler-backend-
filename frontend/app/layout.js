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

export const metadata = {
  title: "LA FORÊT - Agence Immobilière",
  description: "Votre partenaire de confiance pour l'immobilier de luxe en Algérie",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="font-sans text-charcoal-900 antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
