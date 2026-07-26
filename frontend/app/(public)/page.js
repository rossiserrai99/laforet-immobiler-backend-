import React from 'react';
import propertyService from '@/services/property.service';
import { HomeClient } from './HomeClient';

export const metadata = {
  title: "LA FORÊT | Immobilier de Luxe en Algérie",
  description: "Découvrez une collection exclusive de villas, appartements et biens de prestige sélectionnés pour vous.",
};

export const revalidate = 60; // Cache page server-side for 60 seconds

// Next.js App Router allows async server components
export default async function HomePage() {
  // Fetch featured properties directly on the server for SEO and initial load speed
  let featuredProperties = [];
  let featuredApartments = [];
  let allProperties = [];
  
  try {
    const resAll = await propertyService.getAll('?status=Disponible&limit=1000');
    allProperties = resAll.data?.properties || [];

    // Filter directly from allProperties to reduce backend request load from 3 to 1
    const exceptionProps = allProperties.filter(p => p.homePageSection === 'Exception');
    const apartmentProps = allProperties.filter(p => p.homePageSection === 'Apartment');

    featuredProperties = exceptionProps.length > 0 
      ? exceptionProps.slice(0, 6) 
      : allProperties.filter(p => p.type === 'Villa' || p.category === 'Villa' || (p.price && p.price >= 50000000)).slice(0, 6);
    if (featuredProperties.length === 0) featuredProperties = allProperties.slice(0, 6);

    featuredApartments = apartmentProps.length > 0 
      ? apartmentProps.slice(0, 6) 
      : allProperties.filter(p => p.type === 'Appartement' || p.category === 'Appartement').slice(0, 6);
    if (featuredApartments.length === 0) featuredApartments = allProperties.slice(0, 6);
  } catch (err) {
    console.error("Error fetching properties for homepage:", err?.message || err);
  }

  // Pass the server-fetched data to our Client Component which handles all the GSAP animations
  return <HomeClient featuredProperties={featuredProperties} featuredApartments={featuredApartments} allProperties={allProperties} />;
}
