/**
 * ImageKit Integration & Media Optimization Utility
 * Enforces bounded resolutions, automatic modern formats (AVIF/WebP),
 * dedicated thumbnail transformations, and eliminates unbounded originals.
 */

export const IMAGEKIT_ENDPOINT = 
  process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/8jggj5dcd7';

// Base Verified ImageKit Assets
export const BASE_IMAGEKIT_ASSETS = {
  heroVideo: `${IMAGEKIT_ENDPOINT}/laforet_assets/hero_video.mp4`,
  heroPoster: `${IMAGEKIT_ENDPOINT}/laforet_assets/hero_video_poster.png`,
  advisorVendre: `${IMAGEKIT_ENDPOINT}/laforet_assets/advisor_vendre.webp`,
  agencyFallback: `${IMAGEKIT_ENDPOINT}/laforet_assets/agency_fallback.webp`,
  parallaxExpertise: `${IMAGEKIT_ENDPOINT}/laforet_assets/parallax_expertise_bg.jpg`,
  defaultProperty: `${IMAGEKIT_ENDPOINT}/laforet_assets/agency_fallback.webp`,
};

// Owner-Configured Site Assets (with strict fallbacks to verified ImageKit/project assets)
export const SITE_ASSETS = {
  heroVideoDesktop:
    process.env.NEXT_PUBLIC_HERO_VIDEO_DESKTOP_URL ||
    process.env.HERO_VIDEO_DESKTOP_URL ||
    BASE_IMAGEKIT_ASSETS.heroVideo,
  heroVideoMobile:
    process.env.NEXT_PUBLIC_HERO_VIDEO_MOBILE_URL ||
    process.env.HERO_VIDEO_MOBILE_URL ||
    null,
  heroPoster:
    process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER_URL ||
    process.env.HERO_VIDEO_POSTER_URL ||
    BASE_IMAGEKIT_ASSETS.heroPoster,
  banner1:
    process.env.NEXT_PUBLIC_BANNER_1_URL ||
    process.env.BANNER_1_URL ||
    '/luxury_house_buy.png',
  banner2:
    process.env.NEXT_PUBLIC_BANNER_2_URL ||
    process.env.BANNER_2_URL ||
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  banner3:
    process.env.NEXT_PUBLIC_BANNER_3_URL ||
    process.env.BANNER_3_URL ||
    BASE_IMAGEKIT_ASSETS.advisorVendre,
  banner4:
    BASE_IMAGEKIT_ASSETS.agencyFallback,
  parallaxExpertise:
    BASE_IMAGEKIT_ASSETS.parallaxExpertise,
  advisorVendre:
    BASE_IMAGEKIT_ASSETS.advisorVendre,
  agencyFallback:
    BASE_IMAGEKIT_ASSETS.agencyFallback,
  defaultProperty:
    BASE_IMAGEKIT_ASSETS.defaultProperty,
};

// Backward-compatible alias for existing imports
export const IMAGEKIT_ASSETS = {
  heroVideo: SITE_ASSETS.heroVideoDesktop,
  heroVideoMobile: SITE_ASSETS.heroVideoMobile,
  heroPoster: SITE_ASSETS.heroPoster,
  banner1: SITE_ASSETS.banner1,
  banner2: SITE_ASSETS.banner2,
  banner3: SITE_ASSETS.banner3,
  banner4: SITE_ASSETS.banner4,
  advisorVendre: SITE_ASSETS.advisorVendre,
  agencyFallback: SITE_ASSETS.agencyFallback,
  parallaxExpertise: SITE_ASSETS.parallaxExpertise,
  defaultProperty: SITE_ASSETS.defaultProperty,
};

export const DEFAULT_PROPERTY_IMAGE = SITE_ASSETS.defaultProperty;

/**
 * Builds an ImageKit transformation URL from a source URL and transformation string or options.
 * @param {string} src - The image URL or path
 * @param {string|object} transform - e.g. "w-600,h-400,c-maintain_ratio,f-auto,q-80" or { w: 600, h: 400, q: 80 }
 * @returns {string} Optimized URL
 */
export function getImageKitUrl(src, transform = '') {
  if (!src || typeof src !== 'string') return '';

  // Parse object options into comma-separated tr string if provided
  let trStr = '';
  if (typeof transform === 'string') {
    trStr = transform.replace(/^tr:/, '');
  } else if (typeof transform === 'object' && transform !== null) {
    const parts = [];
    if (transform.w) parts.push(`w-${transform.w}`);
    if (transform.h) parts.push(`h-${transform.h}`);
    if (transform.c) parts.push(`c-${transform.c}`);
    if (transform.q) parts.push(`q-${transform.q}`);
    if (transform.f) parts.push(`f-${transform.f}`);
    if (transform.ar) parts.push(`ar-${transform.ar}`);
    trStr = parts.join(',');
  }

  // If not ImageKit, return unmodified (or fallback)
  if (!src.includes('ik.imagekit.io')) {
    // If it's old Cloudinary URL during transition, strip excessive parameters
    if (src.includes('cloudinary.com') && src.includes('/upload/')) {
      return src.replace(/\/upload\/(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9]+,?)*\//i, '/upload/f_auto,q_auto/');
    }
    return src;
  }

  try {
    const urlObj = new URL(src);
    const pathname = urlObj.pathname; // e.g. /8jggj5dcd7/laforet_properties/example.webp or /8jggj5dcd7/tr:w-300/example.webp

    // Split endpoint root and file path
    const endpointPath = new URL(IMAGEKIT_ENDPOINT).pathname.replace(/\/$/, ''); // e.g. /8jggj5dcd7
    let relativePath = pathname.startsWith(endpointPath) 
      ? pathname.slice(endpointPath.length) 
      : pathname;

    // Strip any existing /tr:.../ from path
    relativePath = relativePath.replace(/\/tr:[^/]+/, '');
    if (!relativePath.startsWith('/')) relativePath = '/' + relativePath;

    // Default formatting and quality optimization
    if (!trStr) {
      trStr = 'f-auto,q-80';
    } else {
      if (!trStr.includes('f-')) trStr += ',f-auto';
      if (!trStr.includes('q-')) trStr += ',q-80';
    }

    // Preserve query parameters (like ?updatedAt=...)
    const search = urlObj.search || '';
    return `${IMAGEKIT_ENDPOINT}/tr:${trStr}${relativePath}${search}`;
  } catch {
    return src;
  }
}

/** Standardized Card Thumbnail (~600x400 maintain ratio) */
export function getCardThumbnailUrl(url) {
  return getImageKitUrl(url, 'w-600,h-400,c-maintain_ratio');
}

/** Detail Gallery Thumbnail (~150x150 fill) */
export function getDetailThumbnailUrl(url) {
  return getImageKitUrl(url, 'w-150,h-150,c-fill');
}

/** Detail Hero Image (max 1600px desktop, capped) */
export function getDetailHeroUrl(url) {
  return getImageKitUrl(url, 'w-1600,c-at_max,q-85');
}

/** Fullscreen Lightbox Image (max 2000px bounded) */
export function getLightboxUrl(url) {
  return getImageKitUrl(url, 'w-2000,c-at_max,q-85');
}

/** Photo Grid Item Image (~800x600) */
export function getGridImageUrl(url) {
  return getImageKitUrl(url, 'w-800,h-600,c-maintain_ratio');
}

/** Admin Micro-Thumbnail (~120x120) */
export function getAdminThumbnailUrl(url) {
  return getImageKitUrl(url, 'w-120,h-120,c-fill');
}

/** Safe Bounded Replacement for legacy getHighResUrl */
export function getHighResUrl(url, maxDim = 2000) {
  if (!url) return '';
  return getImageKitUrl(url, `w-${maxDim},h-${maxDim},c-at_max,q-85`);
}
