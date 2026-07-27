import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Maximize, MapPin, ArrowRight } from 'lucide-react';

export function PropertyCard({ property }) {
  // Use cover image if available, else first image, else placeholder
  const imageUrl = property.media?.coverImage?.url 
    || (property.media?.images?.length > 0 ? property.media.images[0].url : null)
    || '/images/placeholder.jpg';

  const priceStr = property.priceHidden 
    ? 'Sur demande' 
    : `${property.price.toLocaleString('fr-DZ')} DZD`;

  return (
    <Link href={`/properties/${property.slug}`} className="block relative h-[280px] sm:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-700">
      {/* Background Image */}
      <Image 
        src={imageUrl}
        alt={property.title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
      />
      
      {/* Dark overlay for base contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/95 via-charcoal-900/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>

      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 sm:top-5 sm:left-5 flex flex-col gap-1 sm:gap-2 z-10">
        <div className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">
          {property.type}
        </div>
        {property.status === 'Vendu' && <div className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-red-500/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">Vendu</div>}
        {property.status === 'Loué' && <div className="px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-gold-500/80 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-lg">Loué</div>}
      </div>

      {/* Main Glass Panel at Bottom */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-5 sm:left-5 sm:right-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-5 overflow-hidden transition-all duration-500 group-hover:bg-white/20 group-hover:border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {/* Visible by default */}
        <div className="relative z-10 flex flex-col gap-0.5 sm:gap-1 mb-0 sm:group-hover:-translate-y-8 transition-transform duration-500 ease-out">
          <h3 className="font-serif text-sm sm:text-xl font-bold text-white line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-white/80 text-[11px] sm:text-sm mb-0.5 sm:mb-1 line-clamp-1">
            <MapPin size={12} className="mr-1 sm:mr-1.5 text-gold-400 shrink-0" />
            <span className="truncate">{property.location?.commune}, {property.location?.wilaya}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-gold-400 font-sans font-bold tracking-wide text-xs sm:text-lg">
              {priceStr}
            </div>
            {/* Show area badge on mobile always */}
            <div className="sm:hidden text-[10px] bg-white/15 px-1.5 py-0.5 rounded text-warm-200 font-medium">
              {property.area} m²
            </div>
          </div>
        </div>

        {/* Hidden info that slides up on hover on desktop */}
        <div className="hidden sm:flex absolute bottom-5 left-5 right-5 justify-between items-center text-white text-sm translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10">
          <div className="flex items-center gap-4">
            {property.bedrooms ? (
              <div className="flex items-center gap-1.5" title="Chambres">
                <Bed size={16} className="text-gold-400" />
                <span className="font-medium">{property.bedrooms}</span>
              </div>
            ) : null}
            {property.bathrooms ? (
              <div className="flex items-center gap-1.5" title="Salles de bain">
                <Bath size={16} className="text-gold-400" />
                <span className="font-medium">{property.bathrooms}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-1.5" title="Surface">
              <Maximize size={16} className="text-gold-400" />
              <span className="font-medium">{property.area} m²</span>
            </div>
          </div>
          
          <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <ArrowRight size={16} className="text-charcoal-900" />
          </div>
        </div>
      </div>
    </Link>
  );
}
