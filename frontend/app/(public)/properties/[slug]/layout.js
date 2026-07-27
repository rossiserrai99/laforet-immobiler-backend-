import React from 'react';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://agenceimmobiliere-laforet.online';

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const res = await fetch(`${apiUrl}/properties/slug/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    const property = data?.data?.property || data?.property;

    if (!property) throw new Error('No property');

    const title = `${property.title} | LA FORÊT - Agence Immobilière de Prestige Alger`;
    const description = `${property.type} à ${property.commune || 'Alger'}, ${property.wilaya || 'Alger'}. ${property.surface ? property.surface + ' m² • ' : ''}${property.price ? property.price.toLocaleString('fr-DZ') + ' DZD' : 'Prix sur demande'}. ${property.description ? property.description.slice(0, 140) + '...' : ''}`;
    const image = property.images?.[0] || `${baseUrl}/opengraph-image`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${baseUrl}/properties/${slug}`,
        siteName: 'LA FORÊT - Agence Immobilière',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
        locale: 'fr_DZ',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (err) {
    return {
      title: 'Propriété de Prestige | LA FORÊT - Agence Immobilière Alger',
      description: "Découvrez notre sélection de biens immobiliers d'exception à Alger (Hydra, El Biar, Ben Aknoun).",
    };
  }
}

export default function PropertyDetailLayout({ children }) {
  return <>{children}</>;
}
