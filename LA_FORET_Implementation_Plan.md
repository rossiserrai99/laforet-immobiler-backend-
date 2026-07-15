# LA FORÊT — Software Implementation Plan
## Version 1.0 | Outfoxed.Dev | Prepared for: Antigravity AI Coding Assistant

---

> **Document Status:** Master Roadmap — Authoritative  
> **Scope:** Full-Stack Web Application (Frontend + Backend + Admin)  
> **Methodology:** Progressive Complexity — Each phase builds exclusively on the phase prior  
> **Instruction to Antigravity:** Do not skip phases. Do not merge phases. Execute sequentially.

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Overall Project Architecture](#2-overall-project-architecture)
3. [Folder Structure](#3-folder-structure)
4. [Component Hierarchy](#4-component-hierarchy)
5. [Routing Structure](#5-routing-structure)
6. [Database Design](#6-database-design)
7. [API Design](#7-api-design)
8. [Cross-Cutting Strategies](#8-cross-cutting-strategies)
   - Authentication Strategy
   - State Management Strategy
   - Image Management Strategy
   - Video Management Strategy
   - Caching Strategy
   - Performance Strategy
   - SEO Strategy
   - Deployment Strategy
   - Error Handling Strategy
   - Logging Strategy
   - Security Strategy
   - Responsive Strategy
   - Animation Strategy
   - Future Scalability Strategy
9. [Development Phases](#9-development-phases)
   - Phase 0: Project Foundation & Monorepo Setup
   - Phase 1: Design System & Token Library
   - Phase 2: Backend Infrastructure & Core Middleware
   - Phase 3: Authentication System
   - Phase 4: Properties & Media API
   - Phase 5: Frontend Shell (Layout, Navigation, Smooth Scrolling)
   - Phase 6: Home Page
   - Phase 7: Properties Listing Page
   - Phase 8: Property Detail Page
   - Phase 9: Supporting Public Pages (About, Services, Contact)
   - Phase 10: Admin Dashboard
   - Phase 11: SEO, Performance & Accessibility Polish
   - Phase 12: QA, Security Audit & Deployment

---

## 1. EXECUTIVE SUMMARY

LA FORÊT is a premium real estate agency website for the Algerian market, combining a public-facing property showcase with a private admin dashboard. The product vision is explicitly aspirational: the digital experience must sit beside Apple, Porsche, and Sotheby's International Realty, not beside conventional Algerian property portals.

This implementation plan governs the construction of:

- A public marketing + listing website built on **Next.js 16 (App Router)**
- A REST API backend built on **Node.js + Express.js**
- A **MongoDB** database served via Atlas
- A **Cloudinary** CDN for all media assets
- An integrated **Admin Dashboard** for property and content management

The plan is divided into **13 sequential phases (Phase 0–12)**. Each phase is independently completable, ends with a working milestone, and has a clear definition of done before the next phase begins. Technical debt is minimized by establishing all foundational architecture early and not allowing feature code to inform infrastructure decisions.

---

## 2. OVERALL PROJECT ARCHITECTURE

### System Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                  Next.js 16 (Vercel CDN Edge)                   │
│         Server Components + Client Components + App Router       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS / REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API SERVER                                  │
│              Node.js + Express.js (Render/Railway)               │
│       JWT Auth │ Rate Limiting │ Helmet │ Input Validation        │
└────────┬────────────────────────────────────┬───────────────────┘
         │ Mongoose ODM                        │ Cloudinary SDK
         ▼                                     ▼
┌──────────────────┐                  ┌────────────────────────────┐
│   MongoDB Atlas  │                  │     Cloudinary CDN          │
│   Collections:   │                  │  Images / Videos / Presets  │
│   properties     │                  │  Transformations / AVIF     │
│   admins         │                  │  WebP / Blur Placeholders   │
│   leads          │                  └────────────────────────────┘
│   testimonials   │
└──────────────────┘
```

### Architecture Principles

| Principle | Decision |
|---|---|
| **Rendering Strategy** | Server Components (default) for all data-fetching; Client Components only for interactivity and animations |
| **Data Fetching** | Server Components fetch directly; Client Components call the Express API |
| **API Layer** | Dedicated Express.js backend — never expose MongoDB directly to the client |
| **Authentication** | JWT stored in HTTP-Only cookies — no localStorage |
| **Media** | All images and videos exclusively through Cloudinary — no local storage |
| **Styling** | Tailwind CSS utility-first; no CSS-in-JS; global CSS only for baseline resets and GSAP targets |
| **Animations** | GSAP for scroll-triggered and timeline animations; Framer Motion for component-level micro-interactions |
| **State** | URL search params for persistent UI state; Zustand for admin dashboard; React state for ephemeral UI |
| **Environment** | Strict separation of frontend and backend environments; no shared `.env` files |

---

## 3. FOLDER STRUCTURE

### Frontend (`/frontend`)

```
frontend/
├── app/
│   ├── (public)/                   # Public route group
│   │   ├── layout.js               # Public layout (Navbar + Footer)
│   │   ├── page.js                 # Home page
│   │   ├── proprietes/
│   │   │   ├── page.js             # Properties listing
│   │   │   └── [slug]/
│   │   │       └── page.js         # Property detail
│   │   ├── a-propos/
│   │   │   └── page.js             # About page
│   │   ├── services/
│   │   │   └── page.js             # Services page
│   │   └── contact/
│   │       └── page.js             # Contact page
│   ├── (admin)/                    # Admin route group
│   │   ├── layout.js               # Admin layout (sidebar + header)
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.js         # Admin login
│   │   │   ├── dashboard/
│   │   │   │   └── page.js         # Admin home / analytics
│   │   │   ├── proprietes/
│   │   │   │   ├── page.js         # Admin property list
│   │   │   │   ├── nouvelle/
│   │   │   │   │   └── page.js     # Create property
│   │   │   │   └── [id]/
│   │   │   │       ├── modifier/
│   │   │   │       │   └── page.js # Edit property
│   │   │   │       └── page.js     # Property preview
│   │   │   ├── media/
│   │   │   │   └── page.js         # Media library
│   │   │   └── parametres/
│   │   │       └── page.js         # Settings
│   ├── api/                        # Next.js route handlers (proxies only)
│   ├── globals.css                 # Global baseline CSS
│   ├── layout.js                   # Root layout
│   ├── not-found.js                # 404 page
│   └── error.js                    # Error boundary page
│
├── components/
│   ├── ui/                         # Primitive design system components
│   │   ├── Button.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Textarea.jsx
│   │   ├── Modal.jsx
│   │   ├── Drawer.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Spinner.jsx
│   │   ├── Tooltip.jsx
│   │   ├── Separator.jsx
│   │   └── index.js
│   ├── layout/                     # Layout-level components
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   ├── NavLogo.jsx
│   │   │   ├── NavLinks.jsx
│   │   │   ├── NavCTA.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   └── index.js
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   ├── FooterBrand.jsx
│   │   │   ├── FooterLinks.jsx
│   │   │   ├── FooterContact.jsx
│   │   │   └── index.js
│   │   └── PageTransition.jsx
│   └── shared/                     # Shared cross-feature components
│       ├── PropertyCard/
│       │   ├── PropertyCard.jsx
│       │   ├── PropertyCardImage.jsx
│       │   ├── PropertyCardSpecs.jsx
│       │   └── index.js
│       ├── SectionHeader.jsx
│       ├── AnimatedCounter.jsx
│       ├── ImageGallery.jsx
│       ├── VideoPlayer.jsx
│       ├── ContactForm.jsx
│       ├── WhatsAppButton.jsx
│       ├── MapPlaceholder.jsx
│       └── ScrollReveal.jsx
│
├── features/
│   ├── home/
│   │   ├── HeroSection/
│   │   │   ├── HeroSection.jsx
│   │   │   ├── HeroVideo.jsx
│   │   │   ├── HeroTypography.jsx
│   │   │   └── HeroSearchBar.jsx
│   │   ├── AgencyIntroSection.jsx
│   │   ├── ValuesSection.jsx
│   │   ├── FeaturedPropertiesSection.jsx
│   │   ├── ServicesSection.jsx
│   │   ├── TestimonialsSection.jsx
│   │   ├── StatisticsSection.jsx
│   │   └── CTASection.jsx
│   ├── properties/
│   │   ├── PropertyGrid.jsx
│   │   ├── PropertyList.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SortSelect.jsx
│   │   ├── ViewToggle.jsx
│   │   ├── ActiveFilters.jsx
│   │   └── Pagination.jsx
│   ├── property-detail/
│   │   ├── PropertyGallery.jsx
│   │   ├── PropertyHeader.jsx
│   │   ├── PropertySpecifications.jsx
│   │   ├── PropertyFeatures.jsx
│   │   ├── PropertyDescription.jsx
│   │   ├── PropertyLocation.jsx
│   │   ├── AgentContactCard.jsx
│   │   ├── VisitRequestForm.jsx
│   │   └── RelatedProperties.jsx
│   ├── about/
│   │   ├── HeroAbout.jsx
│   │   ├── HistoryTimeline.jsx
│   │   ├── MissionSection.jsx
│   │   ├── TeamSection.jsx
│   │   └── WhyUsSection.jsx
│   ├── services/
│   │   ├── ServicesHero.jsx
│   │   └── ServiceDetailCard.jsx
│   ├── contact/
│   │   ├── ContactHero.jsx
│   │   ├── ContactDetails.jsx
│   │   ├── ContactFormSection.jsx
│   │   └── BusinessHours.jsx
│   └── admin/
│       ├── dashboard/
│       │   ├── StatsCard.jsx
│       │   └── RecentLeads.jsx
│       ├── properties/
│       │   ├── PropertyTable.jsx
│       │   ├── PropertyTableRow.jsx
│       │   ├── PropertyForm.jsx
│       │   ├── PropertyFormSections/
│       │   │   ├── GeneralSection.jsx
│       │   │   ├── SpecificationsSection.jsx
│       │   │   ├── FeaturesSection.jsx
│       │   │   ├── LocationSection.jsx
│       │   │   ├── MediaSection.jsx
│       │   │   └── SEOSection.jsx
│       │   └── StatusBadge.jsx
│       └── media/
│           ├── MediaLibrary.jsx
│           ├── UploadZone.jsx
│           └── MediaGrid.jsx
│
├── hooks/
│   ├── useScrolled.js              # Navbar scroll detection
│   ├── useMediaQuery.js            # Responsive breakpoint hooks
│   ├── useDebounce.js              # Search input debounce
│   ├── useIntersection.js          # Intersection Observer hook
│   ├── useProperties.js            # Property data fetching (client)
│   ├── useAdminAuth.js             # Admin auth state
│   ├── useToast.js                 # Toast notification system
│   └── useLocalFavorites.js        # Property favorites (localStorage)
│
├── lib/
│   ├── api.js                      # Axios instance with interceptors
│   ├── gsap.js                     # GSAP registration and defaults
│   ├── lenis.js                    # Lenis smooth scroll setup
│   ├── utils.js                    # General utility functions
│   ├── formatters.js               # Price, surface, date formatters
│   ├── constants.js                # App-wide constants (wilayas, categories, etc.)
│   └── validators.js               # Client-side form validators
│
├── services/
│   ├── properties.service.js       # Property API calls
│   ├── contact.service.js          # Contact/lead API calls
│   ├── auth.service.js             # Admin auth API calls
│   └── media.service.js            # Media upload/delete API calls
│
├── actions/
│   ├── property.actions.js         # Server Actions for property mutations
│   └── contact.actions.js          # Server Actions for contact forms
│
├── store/
│   └── adminStore.js               # Zustand store for admin dashboard
│
├── types/
│   └── index.js                    # JSDoc type definitions (Property, Admin, Lead)
│
├── styles/
│   ├── globals.css                 # Global CSS + GSAP animation targets
│   └── animations.css              # Keyframe animations not handled by GSAP
│
├── public/
│   ├── fonts/                      # Self-hosted font fallbacks
│   ├── icons/                      # SVG icons
│   ├── images/                     # Static images (logo, placeholders)
│   └── og/                         # Open Graph static images
│
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── jsconfig.json
└── .env.local
```

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── properties.controller.js
│   │   ├── media.controller.js
│   │   ├── contact.controller.js
│   │   └── stats.controller.js
│   │
│   ├── routes/
│   │   ├── index.js                # Route aggregator
│   │   ├── auth.routes.js
│   │   ├── properties.routes.js
│   │   ├── media.routes.js
│   │   ├── contact.routes.js
│   │   └── stats.routes.js
│   │
│   ├── models/
│   │   ├── Property.model.js
│   │   ├── Admin.model.js
│   │   ├── Lead.model.js
│   │   └── Testimonial.model.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js       # JWT verification
│   │   ├── error.middleware.js      # Global error handler
│   │   ├── validate.middleware.js   # Joi/Zod request validation
│   │   ├── upload.middleware.js     # Multer + Cloudinary
│   │   ├── rateLimiter.middleware.js
│   │   └── logger.middleware.js
│   │
│   ├── services/
│   │   ├── cloudinary.service.js   # Cloudinary SDK wrapper
│   │   ├── email.service.js        # Future: email notification
│   │   └── slug.service.js         # Slug generation + uniqueness check
│   │
│   ├── validators/
│   │   ├── property.validator.js
│   │   ├── auth.validator.js
│   │   └── contact.validator.js
│   │
│   ├── config/
│   │   ├── database.js             # MongoDB connection
│   │   ├── cloudinary.js           # Cloudinary configuration
│   │   └── environment.js          # Env var validation on startup
│   │
│   └── utils/
│       ├── apiResponse.js          # Standardized response wrapper
│       ├── asyncHandler.js         # Async error wrapper
│       └── generateSlug.js
│
├── app.js                          # Express app factory
├── server.js                       # Entry point (listens on port)
├── package.json
└── .env
```

---

## 4. COMPONENT HIERARCHY

```
RootLayout
└── SmoothScrollProvider (Lenis context)
    └── GSAPProvider (registers plugins globally)
        ├── Navbar
        │   ├── NavLogo (animated on scroll)
        │   ├── NavLinks (desktop)
        │   ├── NavCTA (WhatsApp + Contact button)
        │   └── MobileMenu (Framer Motion drawer)
        │
        ├── PageTransition (Framer Motion wrapper)
        │   └── [Route Page Content]
        │
        └── Footer
            ├── FooterBrand
            ├── FooterLinks (4 columns)
            ├── FooterContact
            └── FooterBottom (copyright)

─── HOME PAGE ───────────────────────────────────────
page.js (Home)
├── HeroSection
│   ├── HeroVideo (autoplay, muted, loop)
│   ├── HeroOverlay (gradient)
│   ├── HeroTypography
│   │   ├── HeroEyebrow (stagger reveal)
│   │   ├── HeroHeading (GSAP SplitText or character stagger)
│   │   └── HeroSubheading (fade up)
│   └── HeroSearchBar (glass morphism)
│       ├── LocationSelect
│       ├── TypeSelect
│       ├── ListingTypeToggle
│       └── SearchButton
├── AgencyIntroSection
│   ├── IntroHeading
│   ├── IntroText
│   └── IntroStatsRow
│       └── StatItem × 4
├── ValuesSection
│   └── ValueCard × 4
├── FeaturedPropertiesSection
│   ├── SectionHeader
│   ├── PropertyCard × N (horizontal scroll on mobile)
│   └── ViewAllCTA
├── ServicesSection
│   └── ServiceCard × 5
├── TestimonialsSection
│   ├── TestimonialCard × N
│   └── Pagination dots
├── StatisticsSection
│   └── AnimatedCounter × 4
└── CTASection

─── PROPERTIES PAGE ─────────────────────────────────
page.js (Properties)
├── PropertiesPageHeader
├── SearchAndFilterBar (sticky)
│   ├── SearchInput (with debounce)
│   ├── FilterButton → FilterPanel (modal/drawer)
│   │   ├── LocationFilter (Wilaya select)
│   │   ├── TypeFilter (checkbox group)
│   │   ├── ListingTypeToggle
│   │   ├── BudgetRangeSlider
│   │   ├── SurfaceRangeSlider
│   │   └── BedroomsSelector
│   ├── SortSelect
│   ├── ViewToggle (Grid / List)
│   └── ActiveFilters (removable filter chips)
├── ResultCount
├── PropertiesGrid | PropertiesList
│   └── PropertyCard × N
│       ├── PropertyCardImage (lazy, blur placeholder)
│       ├── PropertyTypeBadge
│       ├── ListingTypeBadge (Sale/Rent)
│       ├── PropertyTitle
│       ├── PropertyPrice
│       ├── PropertyLocation
│       ├── PropertySpecs (surface, beds, baths)
│       └── PropertyCTA (View Details)
├── EmptyState (when no results)
└── Pagination

─── PROPERTY DETAIL PAGE ────────────────────────────
page.js (Property Detail)
├── PropertyGallery
│   ├── HeroImage (full width, parallax)
│   ├── GalleryThumbnailsRow
│   └── FullscreenGallery (Framer Motion modal)
├── PropertyContentGrid (2-col on desktop)
│   ├── [Left Column]
│   │   ├── PropertyHeader
│   │   │   ├── Breadcrumbs
│   │   │   ├── PropertyBadges
│   │   │   ├── PropertyTitle
│   │   │   ├── PropertyPrice
│   │   │   └── PropertyLocation
│   │   ├── PropertyDescription
│   │   ├── PropertySpecifications
│   │   │   └── SpecItem × N
│   │   ├── PropertyFeatures
│   │   │   └── FeatureTag × N
│   │   ├── VideoPlayer (conditional)
│   │   └── PropertyLocation
│   │       ├── AddressText
│   │       └── MapPlaceholder
│   └── [Right Column - sticky sidebar]
│       └── AgentContactCard
│           ├── AgentName + Photo
│           ├── CallButton
│           ├── WhatsAppButton
│           └── VisitRequestForm
└── RelatedPropertiesSection
    └── PropertyCard × 3

─── ADMIN LAYOUT ────────────────────────────────────
(admin)/layout.js
├── AdminSidebar
│   ├── AdminLogo
│   └── AdminNavLinks
├── AdminTopbar
│   ├── PageTitle
│   └── AdminUserMenu
└── [Admin Page Content]
```

---

## 5. ROUTING STRUCTURE

### Public Routes

| Route | Page | Rendering |
|---|---|---|
| `/` | Home Page | Server Component + Streaming |
| `/proprietes` | Property Listing | Server Component + URL params |
| `/proprietes/[slug]` | Property Detail | Server Component (SSG + ISR) |
| `/a-propos` | About Page | Static (SSG) |
| `/services` | Services Page | Static (SSG) |
| `/contact` | Contact Page | Static (SSG) + Client Form |

### Admin Routes (Protected)

| Route | Page | Guard |
|---|---|---|
| `/admin/login` | Admin Login | Redirect if authenticated |
| `/admin/dashboard` | Dashboard Overview | JWT required |
| `/admin/proprietes` | Property List | JWT required |
| `/admin/proprietes/nouvelle` | Create Property | JWT required |
| `/admin/proprietes/[id]/modifier` | Edit Property | JWT required |
| `/admin/media` | Media Library | JWT required |
| `/admin/parametres` | Settings | JWT required |

### Rendering Strategy per Route

- **Home Page**: Streaming Server Component — hero is static, featured properties fetched server-side with 60s revalidation
- **Property Listing**: Server Component rendering with URL-based search params (no client-side fetch needed for initial paint)
- **Property Detail**: ISR — `revalidate: 3600` (1 hour); on-demand revalidation when admin publishes an update
- **Admin Pages**: Pure Client Components — no server-side data passed; all data fetched via Axios to Express API

---

## 6. DATABASE DESIGN

### Collection: `properties`

```
{
  _id: ObjectId,
  title: { type: String, required: true, trim: true, maxLength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },

  listingType: { type: String, enum: ['sale', 'rent'], required: true },
  category: {
    type: String,
    enum: ['villa', 'apartment', 'studio', 'land', 'commercial', 'office', 'luxury_home'],
    required: true
  },

  price: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['DZD', 'EUR', 'USD'], default: 'DZD' },
  priceNegotiable: { type: Boolean, default: false },

  specifications: {
    surface: { type: Number },
    livingArea: { type: Number },
    landArea: { type: Number },
    bedrooms: { type: Number, min: 0, default: 0 },
    bathrooms: { type: Number, min: 0, default: 0 },
    livingRooms: { type: Number, min: 0, default: 0 },
    kitchens: { type: Number, min: 0, default: 0 },
    garages: { type: Number, min: 0, default: 0 },
    parkingSpaces: { type: Number, min: 0, default: 0 },
    floors: { type: Number, min: 0 },
    yearBuilt: { type: Number }
  },

  features: {
    swimmingPool: { type: Boolean, default: false },
    garden: { type: Boolean, default: false },
    terrace: { type: Boolean, default: false },
    balcony: { type: Boolean, default: false },
    fireplace: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    airConditioning: { type: Boolean, default: false },
    security: { type: Boolean, default: false },
    furnished: { type: Boolean, default: false }
  },

  location: {
    wilaya: { type: String, required: true },
    commune: { type: String, required: true },
    address: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },

  media: {
    heroImage: {
      url: { type: String },
      publicId: { type: String },
      blurPlaceholder: { type: String }
    },
    gallery: [{
      url: { type: String },
      publicId: { type: String },
      blurPlaceholder: { type: String },
      caption: { type: String },
      order: { type: Number, default: 0 }
    }],
    video: {
      url: { type: String },
      publicId: { type: String },
      poster: { type: String }
    }
  },

  seo: {
    metaTitle: { type: String, maxLength: 70 },
    metaDescription: { type: String, maxLength: 160 },
    keywords: [{ type: String }]
  },

  status: {
    type: String,
    enum: ['published', 'draft', 'sold', 'reserved', 'hidden'],
    default: 'draft'
  },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  publishedAt: { type: Date }
}
```

**Indexes:**
- `{ slug: 1 }` — unique
- `{ status: 1, featured: 1 }` — featured query
- `{ listingType: 1, category: 1, status: 1 }` — filter query
- `{ 'location.wilaya': 1 }` — location filter
- `{ price: 1 }` — price sort
- `{ createdAt: -1 }` — default sort

---

### Collection: `admins`

```
{
  _id: ObjectId,
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['super_admin', 'admin'], default: 'admin' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now }
}
```

---

### Collection: `leads`

```
{
  _id: ObjectId,
  type: { type: String, enum: ['contact', 'visit_request', 'info_request'], required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  message: { type: String },
  propertyId: { type: ObjectId, ref: 'Property' },
  propertyTitle: { type: String },
  preferredDate: { type: Date },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  source: { type: String, enum: ['contact_page', 'property_page', 'hero_search'] },
  createdAt: { type: Date, default: Date.now }
}
```

---

### Collection: `testimonials`

```
{
  _id: ObjectId,
  name: { type: String, required: true },
  role: { type: String },
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

---

### Relationships Summary

| Relationship | Type | Notes |
|---|---|---|
| `leads` → `properties` | Many-to-One (optional) | Lead may reference a specific property |
| `admins` ↔ `properties` | Implicit ownership | All properties created by authenticated admins |
| `testimonials` | Standalone | No external references |

---

## 7. API DESIGN

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://api.laforet-immo.dz/api`

### Standard Response Envelope

All API responses follow this structure:

```json
// Success
{
  "success": true,
  "data": { ... },
  "message": "...",
  "meta": { "page": 1, "limit": 12, "total": 87, "pages": 8 }
}

// Error
{
  "success": false,
  "error": {
    "code": "PROPERTY_NOT_FOUND",
    "message": "Property with this slug does not exist",
    "statusCode": 404
  }
}
```

---

### AUTH ENDPOINTS

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Admin login (email + password) |
| `POST` | `/api/auth/logout` | Protected | Clear HTTP-only cookie |
| `GET` | `/api/auth/me` | Protected | Get current admin profile |
| `PATCH` | `/api/auth/change-password` | Protected | Change admin password |

**Login Request:**
```json
{ "email": "admin@laforet.dz", "password": "..." }
```
**Login Response:** Sets `httpOnly` cookie `laforet_token`, returns admin profile (no password).

---

### PROPERTIES ENDPOINTS

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/properties` | Public | List with filters + pagination |
| `GET` | `/api/properties/featured` | Public | Featured properties (max 6) |
| `GET` | `/api/properties/search` | Public | Full-text search |
| `GET` | `/api/properties/:slug` | Public | Single property by slug |
| `POST` | `/api/properties` | Protected | Create new property |
| `PUT` | `/api/properties/:id` | Protected | Full update of property |
| `PATCH` | `/api/properties/:id/status` | Protected | Update status only |
| `PATCH` | `/api/properties/:id/featured` | Protected | Toggle featured flag |
| `DELETE` | `/api/properties/:id` | Protected | Soft-delete (set status=hidden) |

**GET /api/properties Query Parameters:**
```
?listingType=sale|rent
&category=villa|apartment|studio|land|commercial|office|luxury_home
&wilaya=Alger
&minPrice=0
&maxPrice=100000000
&minSurface=0
&maxSurface=2000
&bedrooms=3
&status=published     (public always gets published only)
&featured=true
&sort=price_asc|price_desc|newest|oldest|surface_asc|surface_desc
&page=1
&limit=12
&search=keyword
```

---

### MEDIA ENDPOINTS

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/media/image` | Protected | Upload single image to Cloudinary |
| `POST` | `/api/media/images` | Protected | Upload multiple images (max 20) |
| `POST` | `/api/media/video` | Protected | Upload video to Cloudinary |
| `DELETE` | `/api/media/:publicId` | Protected | Delete asset from Cloudinary |
| `POST` | `/api/media/blur-placeholder` | Protected | Generate blur placeholder from publicId |

---

### CONTACT / LEADS ENDPOINTS

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | General contact form submission |
| `POST` | `/api/contact/visit` | Public | Visit request for a specific property |
| `GET` | `/api/contact/leads` | Protected | Get all leads (with filters) |
| `PATCH` | `/api/contact/leads/:id/status` | Protected | Update lead status |

---

### STATS ENDPOINTS

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/stats/dashboard` | Protected | Dashboard overview (counts, etc.) |

**Dashboard Response:**
```json
{
  "properties": {
    "total": 142,
    "published": 98,
    "draft": 30,
    "sold": 10,
    "reserved": 4
  },
  "leads": {
    "total": 57,
    "new": 12,
    "thisMonth": 8
  },
  "featured": 6
}
```

---

## 8. CROSS-CUTTING STRATEGIES

### Authentication Strategy

- Admin authentication uses **JWT** stored in `httpOnly`, `Secure`, `SameSite=Strict` cookies
- Token expiry: **24 hours** (access token only — no refresh token for admin MVP)
- On expired token, the admin is redirected to `/admin/login` with a redirect-back URL
- Frontend: Next.js middleware (`middleware.js`) reads the cookie and protects all `/admin/*` routes except `/admin/login`
- Backend: `auth.middleware.js` verifies JWT signature and expiry on every protected request
- Password hashing: **bcrypt** with salt rounds = 12
- Admin accounts are seeded manually or via a one-time seed script; no public registration

---

### State Management Strategy

| State Type | Tool | Location |
|---|---|---|
| URL-driven filter state | `useSearchParams` | Properties listing page |
| Server data (public) | Next.js Server Components | Fetched at render time |
| Admin form state | React `useState` | Property form components |
| Admin global state | **Zustand** | `/store/adminStore.js` |
| Toast / notification | React Context | `ToastProvider` in root layout |
| Property favorites | `localStorage` via hook | `useLocalFavorites.js` |
| Modal / drawer open | React `useState` | Local to component |
| Animation state | GSAP internal | Not exposed to React |

**Zustand Admin Store shape:**
```js
{
  admin: null,
  properties: [],
  currentProperty: null,
  isLoading: false,
  pagination: { page: 1, limit: 20, total: 0 },
  filters: {},
  setAdmin, fetchProperties, createProperty,
  updateProperty, deleteProperty, setFilter, resetFilters
}
```

---

### Image Management Strategy

**Upload flow:**
1. Admin selects image(s) in the `UploadZone` component
2. File is sent to `POST /api/media/image` (multipart/form-data)
3. Backend receives via Multer (memory storage — no disk write)
4. Uploads buffer directly to Cloudinary with preset transformations
5. Backend returns `{ url, publicId, blurPlaceholder }`
6. Frontend stores these three values in the property form state

**Cloudinary Upload Preset Configuration:**
```
Folder: laforet/properties/{propertyId}/
Transformations on upload:
  - Auto-format (AVIF → WebP → JPEG fallback)
  - Auto-quality (q_auto:best)
  - Width limit: 2400px (hero), 1200px (gallery), 600px (thumbnail)
  - Strip EXIF metadata
  - Generate eager transformations for 3 sizes
Blur placeholder: w_30,e_blur:1000,q_1,f_auto
```

**Frontend rendering:**
- Use Cloudinary URL transformation params to serve appropriately sized images
- Never serve original upload URL directly — always use transformation URL
- All `<Image>` components use Next.js `<Image>` with `blurDataURL` from `blurPlaceholder`
- Implement `sizes` attribute for responsive srcsets

---

### Video Management Strategy

**Upload:**
- Videos uploaded via Cloudinary's direct upload (large file support)
- Max size: 500MB, max duration: 5 minutes
- Backend generates a signed upload URL for the frontend to upload directly to Cloudinary (bypasses server memory limits)
- After upload, Cloudinary sends webhook with `publicId` and `secure_url`

**Playback:**
- Video embedded via `<video>` HTML element (not iframe)
- Attributes: `autoPlay muted loop playsInline preload="metadata"`
- Poster image: extracted from Cloudinary at 1-second mark (`so_1`)
- Adaptive bitrate via Cloudinary's `sp_auto` streaming profile
- Lazy loading: `IntersectionObserver` triggers `src` assignment on viewport entry

---

### Caching Strategy

| Layer | Strategy | TTL |
|---|---|---|
| Next.js static pages (About, Services) | `cache: 'force-cache'` | Indefinite (until rebuild) |
| Property detail pages | ISR — `revalidate: 3600` | 1 hour |
| Featured properties (Home) | ISR — `revalidate: 60` | 1 minute |
| Property listing | `no-store` (URL params change) | None — always fresh |
| Cloudinary CDN | CDN cache on transformed assets | 30 days |
| API responses (Express) | No server-side caching in MVP | Future: Redis |

---

### Performance Strategy

**Target:** Lighthouse 100 across all categories.

| Area | Action |
|---|---|
| Images | Next.js `<Image>`, AVIF/WebP, `sizes`, blur placeholder, lazy load |
| Video | Lazy mount, `preload="none"` until viewport, poster image |
| Fonts | Self-host or `font-display: swap`; preconnect Google Fonts |
| JavaScript | Code split per route; no full bundle on initial load |
| CSS | Tailwind purge (zero unused CSS in production) |
| Third-party | GSAP and Framer Motion loaded only in client components; no SSR overhead |
| Animations | `will-change: transform` on animated elements; removed after animation completes |
| Server Components | Maximum server component usage to eliminate client bundle size |
| Route prefetching | `<Link prefetch={true}>` for high-probability navigation paths |
| Critical CSS | Inline critical above-the-fold CSS |

---

### SEO Strategy

| Element | Implementation |
|---|---|
| Page `<title>` | Dynamic via Next.js `metadata` export per page |
| Meta description | Dynamic; falls back to property description |
| Open Graph | `og:title`, `og:description`, `og:image` (Cloudinary URL), `og:type` |
| Twitter Card | `summary_large_image` |
| Canonical URLs | Set via `metadata.alternates.canonical` |
| Structured Data | `application/ld+json` — `RealEstateListing`, `Organization`, `BreadcrumbList` |
| Sitemap | Auto-generated at `/sitemap.xml` via Next.js `sitemap.js` |
| Robots | `/robots.txt` — allow all public, disallow `/admin/` |
| Breadcrumbs | Rendered in DOM + `BreadcrumbList` schema |
| Slugs | French-language, human-readable, SEO-optimized |
| Alt text | Mandatory on all images; property title + type on property images |

---

### Deployment Strategy

| Service | What it hosts |
|---|---|
| **Vercel** | Next.js frontend; auto-deploy on `main` branch push |
| **Railway** (or Render) | Node.js + Express backend; Docker container |
| **MongoDB Atlas** | Database (M10 cluster, 3 nodes, automated backups) |
| **Cloudinary** | All media — images + videos |

**Environment Variables:**

Frontend (Vercel):
```
NEXT_PUBLIC_API_URL=https://api.laforet-immo.dz/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
```

Backend (Railway):
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=... (min 64 chars, random)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
FRONTEND_URL=https://laforet-immo.dz
```

**CI/CD:**
- GitHub repository with `main` (production) and `dev` (staging) branches
- Vercel: automatic preview deployments on every PR
- Railway: deploy on push to `main`; manual rollback available

---

### Error Handling Strategy

**Backend:**
- All async route handlers wrapped in `asyncHandler(fn)` — no unhandled promise rejections
- Global error middleware catches all thrown errors
- Custom `AppError` class with `statusCode`, `code`, and `message`
- Validation errors (Joi) return structured 422 response
- Production: no stack traces in response; logged to console only

**Frontend:**
- `error.js` at each route group level for graceful degradation
- `not-found.js` for 404s
- API errors caught in service layer; thrown to component
- `useToast` hook for user-facing error messages
- Network errors show retry prompt

---

### Logging Strategy

- Backend: `morgan` middleware for HTTP request logging (combined format in production)
- Structured console logs with prefix: `[AUTH]`, `[PROPERTY]`, `[MEDIA]`, `[ERROR]`
- No sensitive data in logs (no passwords, no JWT tokens)
- Future: ship logs to a log aggregator (e.g., Logtail on Railway)

---

### Security Strategy

| Threat | Mitigation |
|---|---|
| XSS | React escapes by default; `DOMPurify` on any user HTML (admin description field) |
| CSRF | `SameSite=Strict` cookie; double-submit pattern if needed |
| JWT theft | `httpOnly` cookie — not accessible to JS |
| SQL/NoSQL injection | Mongoose schema validation + Joi input validation |
| Brute force login | `express-rate-limit` — 5 attempts per 15 minutes on `/api/auth/login` |
| Malicious uploads | File type validation (MIME + extension), Cloudinary server-side validation |
| API abuse | General rate limiter: 100 requests/15 min per IP |
| Security headers | `helmet` middleware sets HSTS, CSP, X-Frame-Options, etc. |
| Signed Cloudinary uploads | Upload presets use signed mode — no public upload keys exposed |
| Environment secrets | Never committed to Git; managed via Vercel/Railway env panels |

---

### Responsive Strategy

**Breakpoints (Tailwind custom config):**
```
xs: 375px   (small phones)
sm: 640px   (large phones)
md: 768px   (tablets portrait)
lg: 1024px  (tablets landscape / small desktop)
xl: 1280px  (desktop)
2xl: 1536px (large desktop)
3xl: 1920px (ultrawide — custom addition)
```

**Mobile-first approach throughout.** Every component is designed for 375px first, then enhanced upward.

| Layout | Mobile | Tablet | Desktop |
|---|---|---|---|
| Property grid | 1 column | 2 columns | 3 columns |
| Property detail | stacked | stacked | 2-col with sticky sidebar |
| Navbar | hamburger + drawer | hamburger + drawer | full horizontal |
| Hero search | vertical stack | 2-col | horizontal single row |
| Filter panel | full-screen drawer | sheet | side panel |
| Admin layout | not optimized (desktop tool) | minimal support | full sidebar |

---

### Animation Strategy

**Rule:** Every animation must feel physical, intentional, and cinematic. Zero bounce. Zero flash.

**GSAP — Page-level and scroll-triggered animations:**

| Component | Animation | Implementation |
|---|---|---|
| Hero heading | Character-by-character reveal | `gsap.timeline()` + stagger from `translateY(40px)` to `0` with `opacity: 0→1` |
| Hero video | Slow zoom-in on load | `gsap.to(videoEl, { scale: 1.08, duration: 8, ease: 'none' })` |
| Navbar on scroll | Glass blur appears | `ScrollTrigger` toggles CSS class adding `backdrop-blur-md bg-white/80` |
| Section headers | Fade up on enter | `ScrollTrigger` + `translateY(30px) opacity(0)` → reset |
| Property cards | Stagger fade up | `ScrollTrigger` batch — `stagger: 0.08` on viewport entry |
| Statistics counters | Number roll | Custom `gsap.to({val: 0}, {val: target, onUpdate})` |
| Hero search bar | Float in delayed | Part of hero timeline, 0.6s delay after heading |

**Framer Motion — Component micro-interactions:**

| Component | Animation |
|---|---|
| Property card hover | `whileHover: { y: -4, boxShadow: '...' }` |
| Button hover/tap | `whileHover: { scale: 1.02 }`, `whileTap: { scale: 0.98 }` |
| Mobile nav drawer | `initial: { x: '100%' }` → `animate: { x: 0 }` |
| Gallery fullscreen | `initial: { opacity: 0 }` → `animate: { opacity: 1 }` |
| Page transition | `AnimatePresence` — `opacity: 0 → 1` + subtle `y: 10 → 0` |
| Filter panel | Slide up from bottom (mobile) — `y: '100%' → 0` |
| Toast notification | Slide in from top-right |

**Lenis Smooth Scrolling:**
- Initialize in `SmoothScrollProvider`, pass `lenis` to `gsap.ticker`
- Configure: `lerp: 0.08`, `smoothWheel: true`, `syncTouch: true`
- Disable on admin dashboard (not needed)
- Disable temporarily during gallery fullscreen mode

**Performance guards:**
- Respect `prefers-reduced-motion` media query — disable all non-essential animations
- Use `will-change: transform, opacity` only during animation; remove afterward via `onComplete`

---

### Future Scalability Strategy

| Feature | Preparation Made Now |
|---|---|
| Map view for properties | `coordinates` field in `Property` model; `MapPlaceholder` component as stub |
| 360° virtual tour | `media.tour360` field placeholder in schema |
| Multi-language (AR/FR/EN) | Route groups prepared for `[locale]` prefix; all strings in constants file |
| Property alert subscriptions | `leads` collection can hold subscription type |
| Advanced analytics | `views` field in property; event hook ready in detail page |
| Redis caching | Express service layer abstracted — swap `no-cache` for Redis with minimal changes |
| Email notifications | `email.service.js` stub exists; plug in SendGrid/Resend |
| Multiple agencies / users | `Admin` model has `role` field; RBAC extensible |
| Property comparison | URL-param based: `/proprietes?compare=slug1,slug2` |
| Saved searches | Extend `useLocalFavorites` hook |

---

## 9. DEVELOPMENT PHASES

---

## PHASE 0 — Project Foundation & Monorepo Setup

### Objective
Establish the complete project skeleton for both frontend and backend. All configuration, tooling, environment variables, and folder scaffolding must be in place before a single feature line is written. This phase eliminates all "setup debt" upfront.

### Expected Result
A working monorepo with:
- Next.js frontend that renders a blank page successfully at `localhost:3000`
- Express backend that returns `{ status: "ok" }` at `localhost:5000/api/health`
- Both projects connected to their respective environment configs
- Git repository initialized with `main` and `dev` branches

### Files Created

**Root:**
- `/README.md`
- `/.gitignore`
- `/.env.example` (both projects)

**Frontend:**
- `frontend/next.config.js`
- `frontend/tailwind.config.js`
- `frontend/postcss.config.js`
- `frontend/jsconfig.json`
- `frontend/.env.local`
- `frontend/app/layout.js` (bare root layout)
- `frontend/app/page.js` (bare home placeholder)
- `frontend/app/globals.css` (Tailwind directives only)

**Backend:**
- `backend/app.js`
- `backend/server.js`
- `backend/src/config/environment.js`
- `backend/src/config/database.js`
- `backend/src/routes/index.js`
- `backend/.env`
- `backend/package.json`

### Frontend Tasks
- Init Next.js 16 project with App Router, JavaScript (no TypeScript), Tailwind CSS
- Configure `jsconfig.json` with path aliases: `@/` → `./`
- Configure `next.config.js`: Cloudinary domain in `images.remotePatterns`, no strict mode initially
- Install core dependencies: `axios`, `gsap`, `lenis`, `framer-motion`, `zustand`, `lucide-react`
- Verify blank `app/page.js` renders at localhost:3000

### Backend Tasks
- Init Node.js project (`package.json`, `type: "commonjs"`)
- Install: `express`, `mongoose`, `cors`, `helmet`, `morgan`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `express-rate-limit`, `multer`, `cloudinary`, `joi`
- Create `app.js`: Express factory with `cors`, `helmet`, `morgan`, `express.json()`, routes mounted at `/api`
- Create `server.js`: calls `app.js`, connects DB, starts listen
- Create `GET /api/health` endpoint returning `{ success: true, status: 'ok', timestamp }`
- Configure nodemon for development

### Database Tasks
- Create MongoDB Atlas project and cluster (M0 for dev, M10 for production)
- Whitelist development IP and `0.0.0.0/0` (all IPs) for production
- Create database user with read/write permissions
- Store connection string in `.env`
- Test connection in `config/database.js` with Mongoose

### API Tasks
- Health check endpoint only

### Cloudinary Tasks
- Create Cloudinary account
- Create `laforet` folder structure
- Generate API keys, store in `.env`
- Test SDK connection

### Animations
- None in this phase

### Responsive Tasks
- None in this phase

### Accessibility Tasks
- None in this phase

### SEO Tasks
- None in this phase

### Performance Tasks
- Configure Tailwind purge (content paths)

### Testing Checklist
- [ ] `npm run dev` starts Next.js at localhost:3000 without errors
- [ ] `npm run dev` starts Express at localhost:5000 without errors
- [ ] `GET /api/health` returns 200 with expected JSON
- [ ] MongoDB Atlas connection established (logged on server start)
- [ ] Cloudinary SDK connects without error
- [ ] Path aliases resolve correctly in Next.js
- [ ] Environment variables load correctly in both projects

### Definition of Done
Both servers start without error. MongoDB is connected. Health check endpoint responds. Git history clean with initial commit.

### Potential Risks
- Atlas IP whitelist misconfiguration blocking connection
- Next.js 16 API surface differences from 14/15 — verify App Router conventions

### Dependencies
None — this is the root phase.

### Estimated Complexity
🟢 Low

---

## PHASE 1 — Design System & Token Library

### Objective
Build the visual foundation that every subsequent UI phase depends on. This includes Tailwind configuration, custom color tokens, typography system, spacing scale, and the primitive component library (Button, Badge, Input, Card, etc.). No page-level components yet.

### Expected Result
A living design system where:
- All brand colors, fonts, and spacing are codified as Tailwind tokens
- Every primitive UI component (Button, Badge, Input, etc.) exists and is visually correct
- A dedicated component preview page (`/design-system`) renders all components for QA
- Fonts load correctly with proper fallbacks

### Files Created
- `frontend/tailwind.config.js` (complete config with all custom tokens)
- `frontend/app/globals.css` (complete global CSS, CSS custom properties)
- `frontend/styles/animations.css`
- `frontend/components/ui/Button.jsx`
- `frontend/components/ui/Badge.jsx`
- `frontend/components/ui/Card.jsx`
- `frontend/components/ui/Input.jsx`
- `frontend/components/ui/Select.jsx`
- `frontend/components/ui/Textarea.jsx`
- `frontend/components/ui/Modal.jsx`
- `frontend/components/ui/Drawer.jsx`
- `frontend/components/ui/Skeleton.jsx`
- `frontend/components/ui/Spinner.jsx`
- `frontend/components/ui/Separator.jsx`
- `frontend/components/ui/index.js`
- `frontend/app/(design-system)/page.js` (dev-only preview page)
- `frontend/lib/constants.js`

### Frontend Tasks

**Tailwind Configuration:**
```
Colors:
  forest: { 50: ..., 100: ..., 500: '#2D5016', 600: '#1F3D0C', 900: '#0F1F06' }
  gold: { 300: '#D4AF37', 400: '#C9A227', 500: '#B8940F' }
  charcoal: { 800: '#1A1A1A', 900: '#0D0D0D' }
  warm: { 50: '#FAFAF8', 100: '#F5F4F0', 400: '#9E9B94' }

Font families:
  serif: ['Cormorant Garamond', 'Georgia', 'serif']
  sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif']

Custom spacing:
  18: '4.5rem', 22: '5.5rem', 30: '7.5rem'

Custom borderRadius:
  '4xl': '2rem', '5xl': '2.5rem'

Custom screens:
  xs: '375px', '3xl': '1920px'
```

**CSS Custom Properties (globals.css):**
```css
:root {
  --color-forest: #2D5016;
  --color-gold: #D4AF37;
  --color-bg: #FFFFFF;
  --color-charcoal: #1A1A1A;
  --color-warm-gray: #9E9B94;
  --transition-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Typography System:**
- Load `Cormorant Garamond` (Light 300, Regular 400, Medium 500, SemiBold 600) via `next/font/google`
- Load `DM Sans` (Regular 400, Medium 500, SemiBold 600) via `next/font/google`
- Define heading scale: `h1`=clamp(3rem,6vw,6rem), `h2`=clamp(2rem,4vw,3.5rem), etc.
- Letter spacing: headings -0.02em; body 0em

**Button Component Variants:**
- `primary` — forest green background, white text, gold hover ring
- `secondary` — transparent, forest green border and text
- `ghost` — no border, forest green text, subtle bg on hover
- `gold` — gold background, dark text
- `icon` — square, icon only
- Sizes: `sm`, `md`, `lg`
- States: default, hover, focus-visible, disabled, loading (spinner)

**Badge Component Variants:**
- `sale` — forest green
- `rent` — gold
- `sold` — charcoal
- `reserved` — warm gray
- `featured` — gold + star icon
- `draft` — muted

**Card Component:**
- Base card with `rounded-3xl shadow-sm` and optional `hover-lift` variant
- Glass card variant with `backdrop-blur-md bg-white/80`

**Input, Select, Textarea:**
- Consistent border style: `border-warm-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20`
- Label always above (not floating — simpler, more legible)
- Error state with red border + error message below

**Skeleton Component:**
- Animated shimmer using CSS `@keyframes shimmer`
- Variants: text-line, card, image, avatar

**constants.js** must contain:
- `WILAYAS` — all 58 Algerian wilayas
- `PROPERTY_CATEGORIES` — all types with French labels
- `LISTING_TYPES` — sale / rent
- `PROPERTY_STATUSES`
- `CURRENCIES`
- `SORT_OPTIONS`

### Animations
- Skeleton shimmer animation (pure CSS)
- Button hover transitions (Tailwind `transition-all duration-200`)
- No GSAP or Framer Motion in this phase

### Responsive Tasks
- All primitive components must work at all breakpoints
- Button sizes adapt naturally via padding
- Modal becomes full-screen on mobile

### Accessibility Tasks
- All interactive elements have `focus-visible` ring (forest color)
- Buttons use semantic `<button>` elements
- Form inputs have associated `<label>` via `htmlFor`/`id` pair
- Modal traps focus when open; `aria-modal`, `role="dialog"`, `aria-labelledby`
- Color contrast verified: all text on white backgrounds passes WCAG AA (4.5:1 minimum)

### SEO Tasks
- None in this phase

### Performance Tasks
- Fonts loaded with `display: 'swap'` via `next/font`
- CSS custom properties declared at `:root` (not duplicated per component)

### Testing Checklist
- [ ] Design system preview page renders all components without errors
- [ ] All button variants and states display correctly
- [ ] All badge variants display correctly
- [ ] Fonts load with correct weights (inspect DevTools Network tab)
- [ ] Color tokens resolve correctly in Tailwind classes
- [ ] Input focus state shows ring with correct color
- [ ] Modal opens, closes, and traps focus
- [ ] Skeleton shimmer animates smoothly
- [ ] All components are accessible via keyboard

### Definition of Done
All primitive UI components render correctly in the design system preview page. Typography, colors, and spacing match the brand specification. All components pass keyboard navigation and color contrast checks.

### Potential Risks
- Font loading impacting Lighthouse CLS score — mitigate by reserving space (`min-h` on headings)
- Tailwind JIT not picking up custom tokens — verify `content` paths in config

### Dependencies
- Phase 0 complete

### Estimated Complexity
🟡 Medium

---

## PHASE 2 — Backend Infrastructure & Core Middleware

### Objective
Build the complete Express backend foundation: all models, all middleware, request validation, error handling, logging, and security configuration. No feature endpoints yet — only infrastructure.

### Expected Result
A production-grade Express server with:
- All Mongoose models defined with correct schemas and indexes
- All middleware wired: Helmet, CORS, rate limiting, Morgan logging, error handler
- Request validation framework (Joi) configured
- Standardized API response utility
- Database connection stable with graceful reconnect

### Files Created
- `backend/src/models/Property.model.js`
- `backend/src/models/Admin.model.js`
- `backend/src/models/Lead.model.js`
- `backend/src/models/Testimonial.model.js`
- `backend/src/middlewares/error.middleware.js`
- `backend/src/middlewares/validate.middleware.js`
- `backend/src/middlewares/rateLimiter.middleware.js`
- `backend/src/middlewares/logger.middleware.js`
- `backend/src/utils/apiResponse.js`
- `backend/src/utils/asyncHandler.js`
- `backend/src/utils/generateSlug.js`
- `backend/src/config/environment.js`
- `backend/src/validators/property.validator.js`
- `backend/src/validators/auth.validator.js`
- `backend/src/validators/contact.validator.js`

### Frontend Tasks
- None in this phase

### Backend Tasks
- Implement `asyncHandler(fn)` — wraps async route handlers, catches errors, passes to `next(err)`
- Implement custom `AppError` class extending `Error` with `statusCode`, `code`, `isOperational`
- Implement `errorMiddleware` — distinguishes operational vs programming errors; returns standard error envelope; strips stack traces in production
- Implement `validateMiddleware(schema)` — factory function returning middleware that validates `req.body` against Joi schema, returns 422 on failure
- Configure `helmet()` with custom CSP allowing Cloudinary and Google Fonts
- Configure `cors({ origin: FRONTEND_URL, credentials: true })`
- Configure general rate limiter (100 req/15 min per IP)
- Configure strict rate limiter for auth routes (5 req/15 min per IP)
- Set `express.json({ limit: '10mb' })` for description fields
- Implement Mongoose connection with retry logic (3 attempts, 5s apart)
- Implement `generateSlug(title)` — slugify, check uniqueness in DB, append `-2`, `-3` if collision
- Implement standardized `apiResponse.js`: `success(res, data, message, meta)` and `error(res, error)`

### Database Tasks
- Define and export all 4 Mongoose models (see schemas in Section 6)
- Apply all indexes as defined in the Property model
- Test that all models connect and that `.save()` operations work on test documents

### API Tasks
- `GET /api/health` — already from Phase 0, verify it still works

### Cloudinary Tasks
- None in this phase

### Animations
- None

### Responsive Tasks
- None

### Accessibility Tasks
- None

### SEO Tasks
- None

### Performance Tasks
- Mongoose connections pooled (default pool size: 5, increase to 10 in production)

### Testing Checklist
- [ ] All 4 Mongoose models can be instantiated and saved to MongoDB
- [ ] `asyncHandler` catches promise rejections and passes to error middleware
- [ ] Error middleware returns correct JSON envelope for operational errors
- [ ] Error middleware returns generic 500 for programming errors (no stack trace in prod)
- [ ] `validateMiddleware` returns 422 with field errors for invalid input
- [ ] Helmet headers visible in response (inspect DevTools Network)
- [ ] Rate limiter blocks after 5 attempts on auth route
- [ ] CORS allows requests from `FRONTEND_URL` only
- [ ] `generateSlug` appends suffix on collision
- [ ] Database retries on connection failure

### Definition of Done
All models exist. All middleware wires correctly. No unhandled promise rejections. Error response format is consistent. Indexes verified in Atlas UI.

### Potential Risks
- Mongoose index creation on startup — slow on Atlas cold start; use `{ autoIndex: false }` in production and create indexes via Atlas UI
- CORS misconfiguration blocking admin panel

### Dependencies
- Phase 0 complete

### Estimated Complexity
🟡 Medium

---

## PHASE 3 — Authentication System

### Objective
Implement the complete admin authentication system: login, logout, token verification, and frontend route protection. This phase gates all subsequent admin functionality.

### Expected Result
An admin can:
- Log in at `/admin/login` with email + password
- Receive a JWT stored in an HTTP-only cookie
- Access protected pages at `/admin/*`
- Log out, clearing the cookie
- Be redirected to login when accessing protected routes unauthenticated

### Files Created

**Backend:**
- `backend/src/controllers/auth.controller.js`
- `backend/src/routes/auth.routes.js`

**Frontend:**
- `frontend/app/(admin)/admin/login/page.js`
- `frontend/app/(admin)/layout.js`
- `frontend/middleware.js` (Next.js route middleware)
- `frontend/services/auth.service.js`
- `frontend/hooks/useAdminAuth.js`
- `frontend/store/adminStore.js` (auth slice only for now)
- `frontend/lib/api.js` (Axios instance)
- `frontend/features/admin/LoginForm.jsx`

### Frontend Tasks
- Implement Next.js `middleware.js` at root: reads `laforet_token` cookie, redirects to `/admin/login` if missing on any `/admin/*` path except `/admin/login`
- Implement `lib/api.js`: Axios instance with `baseURL: process.env.NEXT_PUBLIC_API_URL`, `withCredentials: true`; response interceptor that redirects to login on 401
- Implement `services/auth.service.js`: `login(email, password)`, `logout()`, `getMe()`
- Build `LoginForm.jsx`: email + password inputs, submit button with loading state, error message display
- Build `/admin/login/page.js`: centered login card, agency logo, form
- Build `(admin)/layout.js`: minimal wrapper that only renders children (sidebar added in Phase 10)
- Implement `useAdminAuth` hook: reads from Zustand store, provides `admin`, `isLoading`, `logout`

### Backend Tasks
- Implement `auth.controller.js`:
  - `login`: validate body (Joi), find admin by email, compare password with bcrypt, sign JWT (payload: `{ id, email, role }`), set `httpOnly` cookie, return admin profile
  - `logout`: clear cookie
  - `getMe`: decode token from cookie, return admin profile
  - `changePassword`: verify current password, hash new password, save
- Implement `auth.middleware.js`: extract JWT from cookie (not header), verify signature, attach `req.admin` to request, call `next()` or throw 401
- Register `auth.routes.js` in main router
- Apply strict rate limiter to `POST /api/auth/login`
- Seed script: create initial admin account (`node src/scripts/seed-admin.js`)

### Database Tasks
- `Admin.model.js` pre-save hook: hash password with bcrypt before save
- `Admin.model.js` instance method: `comparePassword(plaintext)` returns boolean

### API Tasks
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Cloudinary Tasks
- None

### Animations
- Login form: Framer Motion `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`

### Responsive Tasks
- Login page: centered card, works on all screen sizes

### Accessibility Tasks
- Login form: labels on all inputs, `aria-invalid` on error, `aria-live` on error messages

### SEO Tasks
- Add `robots` `noindex` to all admin pages via `export const metadata = { robots: 'noindex' }`

### Performance Tasks
- bcrypt cost factor: 12 (secure but not too slow for single-user admin)

### Testing Checklist
- [ ] `POST /api/auth/login` with valid credentials returns 200 and sets cookie
- [ ] `POST /api/auth/login` with wrong password returns 401
- [ ] `GET /api/auth/me` with valid cookie returns admin profile
- [ ] `GET /api/auth/me` without cookie returns 401
- [ ] `POST /api/auth/logout` clears cookie
- [ ] Visiting `/admin/dashboard` without cookie redirects to `/admin/login`
- [ ] After login, redirects to `/admin/dashboard`
- [ ] Rate limiter blocks 6th login attempt within 15 minutes
- [ ] Password never appears in any API response

### Definition of Done
Admin can log in, access the dashboard, and log out. Route protection works via middleware. Cookie is HTTP-only and not accessible in browser console.

### Potential Risks
- Cookie not sent cross-origin — ensure `withCredentials: true` on Axios and `credentials: true` on CORS
- Next.js middleware running on Edge Runtime — use cookie utilities compatible with edge

### Dependencies
- Phase 0, 1, 2 complete

### Estimated Complexity
🟡 Medium

---

## PHASE 4 — Properties & Media API

### Objective
Build the complete properties REST API with full CRUD, Cloudinary media integration, search and filter system, and pagination. This is the core data layer that all public and admin pages consume.

### Expected Result
All property endpoints work correctly. Images and videos can be uploaded to Cloudinary and referenced in properties. The search and filter system returns correctly filtered, paginated results.

### Files Created

**Backend:**
- `backend/src/controllers/properties.controller.js`
- `backend/src/controllers/media.controller.js`
- `backend/src/routes/properties.routes.js`
- `backend/src/routes/media.routes.js`
- `backend/src/middlewares/upload.middleware.js`
- `backend/src/services/cloudinary.service.js`
- `backend/src/services/slug.service.js`
- `backend/src/validators/property.validator.js`
- `backend/src/scripts/seed-properties.js` (dev only — creates 10 sample properties)

### Frontend Tasks
- Implement `services/properties.service.js`: `getProperties(params)`, `getProperty(slug)`, `getFeaturedProperties()`, `createProperty(data)`, `updateProperty(id, data)`, `deleteProperty(id)`, `updateStatus(id, status)`, `toggleFeatured(id)`
- Implement `services/media.service.js`: `uploadImage(file)`, `uploadImages(files)`, `deleteMedia(publicId)`

### Backend Tasks

**Properties Controller:**
- `list`: Build dynamic Mongoose query from query params; apply all filters (`listingType`, `category`, `wilaya`, `minPrice`, `maxPrice`, `minSurface`, `maxSurface`, `bedrooms`, `status`); for public calls, always add `{ status: 'published' }`; apply sort; paginate with `skip`/`limit`; return with `meta`
- `getFeatured`: find published + featured, limit 6, sort by `publishedAt desc`
- `getBySlug`: find by slug, increment `views` counter, populate nothing (no refs needed)
- `create`: validate body (Joi), generate slug from title, create document
- `update`: validate body (Joi), update document, regenerate slug if title changed
- `updateStatus`: PATCH status field only
- `toggleFeatured`: PATCH featured field only
- `remove`: set `status: 'hidden'` (soft delete), never hard delete

**Media Controller:**
- `uploadImage`: receive file via Multer (memory storage), upload buffer to Cloudinary with `laforet/properties` folder and transformation preset, generate blur placeholder (30px width, blur:1000, q:1), return `{ url, publicId, blurPlaceholder }`
- `uploadImages`: same as above but loop over `req.files` array (max 20)
- `uploadVideo`: upload video, extract poster at 1s mark
- `deleteMedia`: call `cloudinary.uploader.destroy(publicId)` with resource type

**upload.middleware.js:**
- Configure Multer with `memoryStorage()` (no disk writes)
- Validate file type: images — MIME must be `image/jpeg|png|webp|avif`; max size 10MB
- Validate video: MIME `video/mp4|mov`; max size 500MB

**cloudinary.service.js:**
- Configure Cloudinary SDK with env vars
- `uploadImage(buffer, options)` — returns standardized result
- `uploadVideo(buffer, options)` — returns with eager poster
- `deleteAsset(publicId, resourceType)` — returns deletion result
- `generateBlurPlaceholder(publicId)` — returns base64 blurred tiny image

### Database Tasks
- Verify all indexes are correctly applied in Atlas
- Run `seed-properties.js` script to populate development data (10 diverse properties)

### API Tasks
All endpoints listed in Section 7 for properties and media, fully implemented.

### Cloudinary Tasks
- Create upload preset `laforet_properties` with auto-format, auto-quality
- Create eager transformation for hero (2400px), gallery (1200px), thumbnail (600px)
- Test signed upload works correctly
- Test deletion works correctly
- Verify AVIF/WebP is served to supporting browsers

### Animations
- None

### Responsive Tasks
- None

### Accessibility Tasks
- None

### SEO Tasks
- None

### Performance Tasks
- Cloudinary `q_auto` quality reduces payload by 30-50% automatically
- Blur placeholder generated once at upload time, stored in DB — no runtime computation

### Testing Checklist
- [ ] `POST /api/properties` creates property with correct data
- [ ] `GET /api/properties` returns paginated results with meta
- [ ] `GET /api/properties?listingType=sale` filters correctly
- [ ] `GET /api/properties?wilaya=Alger` filters correctly
- [ ] `GET /api/properties?minPrice=5000000&maxPrice=20000000` filters correctly
- [ ] `GET /api/properties/:slug` returns correct property and increments views
- [ ] `GET /api/properties/featured` returns max 6 featured published properties
- [ ] `PUT /api/properties/:id` updates property correctly
- [ ] `PATCH /api/properties/:id/status` updates status only
- [ ] `DELETE /api/properties/:id` sets status to hidden
- [ ] `POST /api/media/image` uploads to Cloudinary and returns url + publicId + blurPlaceholder
- [ ] `DELETE /api/media/:publicId` removes from Cloudinary
- [ ] Malformed file type (e.g. .exe) is rejected with 400
- [ ] Public `GET /api/properties` never returns draft/hidden/sold properties
- [ ] Slug collision appends suffix correctly

### Definition of Done
All CRUD operations work correctly. Images upload to Cloudinary successfully. Filtering, sorting, and pagination all work correctly. Unauthenticated users can only access published properties.

### Potential Risks
- Multer memory storage on large files — large videos should use Cloudinary's direct signed upload flow rather than going through the backend server
- Cloudinary rate limits on bulk seed uploads — add 200ms delay between uploads in seed script

### Dependencies
- Phase 0, 2, 3 complete

### Estimated Complexity
🔴 High

---

## PHASE 5 — Frontend Shell (Layout, Navigation, Smooth Scrolling)

### Objective
Build the persistent UI shell: root layout, Navbar, Footer, smooth scrolling with Lenis, GSAP initialization, and page transition system. Every subsequent page phase inherits this shell.

### Expected Result
Navigating between pages shows a smooth glass navbar, a footer, page transitions, and buttery smooth scrolling. The Navbar responds to scroll with glass blur effect. Mobile navigation works via a drawer.

### Files Created
- `frontend/app/layout.js` (complete root layout)
- `frontend/app/(public)/layout.js`
- `frontend/components/layout/Navbar/Navbar.jsx`
- `frontend/components/layout/Navbar/NavLogo.jsx`
- `frontend/components/layout/Navbar/NavLinks.jsx`
- `frontend/components/layout/Navbar/NavCTA.jsx`
- `frontend/components/layout/Navbar/MobileMenu.jsx`
- `frontend/components/layout/Navbar/index.js`
- `frontend/components/layout/Footer/Footer.jsx`
- `frontend/components/layout/Footer/FooterBrand.jsx`
- `frontend/components/layout/Footer/FooterLinks.jsx`
- `frontend/components/layout/Footer/FooterContact.jsx`
- `frontend/components/layout/Footer/index.js`
- `frontend/components/layout/PageTransition.jsx`
- `frontend/lib/gsap.js`
- `frontend/lib/lenis.js`
- `frontend/hooks/useScrolled.js`
- `frontend/hooks/useMediaQuery.js`
- `frontend/app/not-found.js`
- `frontend/app/error.js`

### Frontend Tasks

**Root Layout (`app/layout.js`):**
- Mount Google Fonts via `next/font`
- Provide Lenis smooth scroll context
- Provide GSAP context (register plugins)
- Include `PageTransition` wrapper
- Set HTML `lang="fr"`

**Lenis Setup (`lib/lenis.js`):**
- Create `SmoothScrollProvider` Client Component
- Initialize Lenis: `lerp: 0.08, smoothWheel: true, syncTouch: true`
- Integrate Lenis with GSAP ticker: `gsap.ticker.add(time => lenis.raf(time * 1000))`
- Export `useLenis()` hook for components that need to temporarily pause scroll

**GSAP Setup (`lib/gsap.js`):**
- Import `gsap` and register plugins: `ScrollTrigger`, `ScrollToPlugin`, optionally `SplitText` (if license permits; otherwise manual character splitting)
- Set GSAP defaults: `ease: 'power2.out'`, `duration: 0.7`
- Export configured `gsap` instance

**Navbar:**
- `'use client'` directive
- Position: `fixed top-0 left-0 right-0 z-50`
- Initial state: `bg-transparent` (for hero pages), `bg-white/95 backdrop-blur-md shadow-sm` (for non-hero pages)
- Scroll behavior via `useScrolled(threshold: 20)`:
  - On scroll > 20px: add glass classes, reduce padding (compact mode), scale logo slightly down
  - Animate class toggle with Framer Motion `AnimatePresence` or CSS transition
- Desktop: Logo left, Nav links center, CTA right
- Mobile: Logo left, Hamburger right → opens `MobileMenu`
- `MobileMenu`: Framer Motion slide from right — `x: '100%'` → `x: 0`; full-height overlay; all nav links + CTA + close button

**Nav Links:** Propriétés | À Propos | Services | Contact  
**Nav CTA:** "Nous Contacter" (primary button, small) + WhatsApp icon button

**Footer:**
- 4-column grid (desktop), 2-column (tablet), stacked (mobile)
- Column 1: Brand + tagline + social links
- Column 2: Navigation links
- Column 3: Services links
- Column 4: Contact (phone, email, address)
- Bottom bar: copyright + "Powered by" (optional)
- Forest green background, white text

**PageTransition:**
- Framer Motion `AnimatePresence` wrapping page content
- `initial: { opacity: 0, y: 8 }` → `animate: { opacity: 1, y: 0 }` → `exit: { opacity: 0, y: -8 }`
- Duration: 0.35s, ease: `power2.inOut`

**404 Page:**
- "404 — Page Introuvable" with elegant typography and a CTA back to home

**Error Page:**
- "Une erreur s'est produite" with retry button

### Backend Tasks
- None in this phase

### Database Tasks
- None in this phase

### API Tasks
- None in this phase

### Cloudinary Tasks
- None in this phase

### Animations
- **Navbar:** CSS transition on `backdrop-blur` and `background-color` classes (60fps without GSAP overhead)
- **Navbar logo:** Framer Motion `animate={{ scale: scrolled ? 0.85 : 1 }}`
- **MobileMenu:** Framer Motion `initial={{ x: '100%' }}` → `animate={{ x: 0 }}`, `transition={{ type: 'tween', duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}`
- **Page transition:** Framer Motion `AnimatePresence` as above

### Responsive Tasks
- Navbar: desktop links hidden on mobile (`hidden lg:flex`), hamburger shown on mobile (`flex lg:hidden`)
- Footer: 4-col grid collapses to 2-col at `md`, 1-col at `sm`
- Mobile menu: full screen width, full height
- Test sticky navbar on iOS Safari (fixed + backdrop-filter issues)

### Accessibility Tasks
- Navbar: `<nav>` semantic element, `aria-label="Navigation principale"`
- Mobile menu: `role="dialog"`, `aria-modal="true"`, focus trap, `Escape` key closes
- Active link: `aria-current="page"` on matching route
- Skip-to-content link: `<a href="#main-content">` visible on focus, hidden by default

### SEO Tasks
- Verify Navbar links are crawlable `<a>` elements (not buttons)
- Footer links assist crawlability

### Performance Tasks
- Navbar uses CSS transitions (not JS) for scroll state — no `requestAnimationFrame` overhead
- Lenis and GSAP only initialized in browser (Client Components) — no SSR penalty

### Testing Checklist
- [ ] Navbar appears correctly on all screen sizes
- [ ] Navbar transitions to glass state on scroll > 20px
- [ ] Mobile hamburger opens full-screen menu
- [ ] Mobile menu closes on nav link click
- [ ] Mobile menu closes on Escape key
- [ ] Mobile menu traps focus
- [ ] Page transition plays on route change
- [ ] Lenis smooth scroll works (no choppy scrolling)
- [ ] GSAP ScrollTrigger can be used by importing from `lib/gsap.js`
- [ ] Footer renders correctly at all breakpoints
- [ ] 404 page renders on unknown routes
- [ ] Skip-to-content link appears on Tab key press

### Definition of Done
Shell is complete. Navbar, footer, smooth scrolling, and page transitions work on all devices. The project is ready to receive individual page content.

### Potential Risks
- Lenis + GSAP ScrollTrigger integration requires careful ticker setup — test scroll position accuracy
- iOS `backdrop-filter: blur()` on fixed elements has known rendering bugs — test on real device

### Dependencies
- Phase 0, 1 complete

### Estimated Complexity
🟡 Medium-High

---

## PHASE 6 — Home Page

### Objective
Build the flagship page — the primary brand impression for every visitor. This page must communicate luxury, trust, and expertise within 3 seconds of loading. Every section has a dedicated animation timeline.

### Expected Result
A fully animated, responsive home page with: auto-playing hero video, animated typography, glass search bar, agency introduction with animated counters, values section, featured properties carousel (pulling live data), services section, testimonials, statistics, and a CTA section.

### Files Created
- `frontend/app/(public)/page.js`
- `frontend/features/home/HeroSection/HeroSection.jsx`
- `frontend/features/home/HeroSection/HeroVideo.jsx`
- `frontend/features/home/HeroSection/HeroTypography.jsx`
- `frontend/features/home/HeroSection/HeroSearchBar.jsx`
- `frontend/features/home/AgencyIntroSection.jsx`
- `frontend/features/home/ValuesSection.jsx`
- `frontend/features/home/FeaturedPropertiesSection.jsx`
- `frontend/features/home/ServicesSection.jsx`
- `frontend/features/home/TestimonialsSection.jsx`
- `frontend/features/home/StatisticsSection.jsx`
- `frontend/features/home/CTASection.jsx`
- `frontend/components/shared/PropertyCard/PropertyCard.jsx`
- `frontend/components/shared/PropertyCard/PropertyCardImage.jsx`
- `frontend/components/shared/PropertyCard/PropertyCardSpecs.jsx`
- `frontend/components/shared/PropertyCard/index.js`
- `frontend/components/shared/SectionHeader.jsx`
- `frontend/components/shared/AnimatedCounter.jsx`
- `frontend/components/shared/ScrollReveal.jsx`
- `frontend/components/shared/WhatsAppButton.jsx`

### Frontend Tasks

**`app/(public)/page.js` (Server Component):**
- Fetch featured properties server-side with `fetch(API_URL/properties/featured, { next: { revalidate: 60 } })`
- Fetch testimonials server-side
- Pass data as props to Client Component sections
- Export `generateMetadata` with full Open Graph for home page

**HeroSection:**
- Full viewport height (`100dvh`)
- `HeroVideo`: `<video>` element, `autoPlay muted loop playsInline`, Cloudinary URL, poster image. GSAP slow zoom: `gsap.to(videoEl, { scale: 1.08, duration: 10, ease: 'none' })` starts on page load
- Dark gradient overlay: `bg-gradient-to-b from-black/60 via-black/30 to-black/70`
- `HeroTypography`: GSAP timeline on mount:
  - `t=0`: eyebrow text fades up (opacity 0→1, y: 20→0, duration: 0.6)
  - `t=0.3`: H1 character stagger (split by word, stagger: 0.06, y: 60→0, opacity 0→1)
  - `t=0.9`: subheading fades up (opacity 0→1, y: 20→0, duration: 0.7)
  - `t=1.4`: search bar floats up (opacity 0→1, y: 20→0, duration: 0.6)
- **Eyebrow:** "Agence Immobilière de Prestige · Depuis 2002" in gold, small caps
- **H1:** "LA FORÊT" — serif, massive (clamp 4rem,10vw,10rem), white
- **Subheading:** "Votre partenaire de confiance pour l'immobilier de luxe en Algérie" — sans, white/80
- `HeroSearchBar`: glass morphism card (`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl`). Contains: Location select (wilaya), Property type select, Sale/Rent toggle, Search button (gold). On submit, navigates to `/proprietes` with search params

**AgencyIntroSection:**
- 2-column: left is large text block (H2 + paragraph), right is 4 stats in 2x2 grid
- Stats: "Since 2002", "500+ Properties", "1000+ Clients", "5 Services"
- `ScrollReveal` wrapper: GSAP `fromVars: { opacity: 0, y: 40 }` on viewport entry

**ValuesSection:**
- 4 cards in a grid: Trust, Prestige, Confidentiality, Excellence
- Each card: icon (Lucide), title, short description
- Card reveal: GSAP `stagger: 0.15` from bottom

**FeaturedPropertiesSection:**
- H2 "Nos Biens en Vedette" + "Voir Tout" link
- Horizontal scrolling container on mobile; 3-column grid on desktop
- `PropertyCard` components populated with server-fetched data
- "Voir Tout" → `/proprietes?featured=true`

**PropertyCard (shared):**
- `rounded-3xl overflow-hidden shadow-sm` base
- `PropertyCardImage`: Next.js `<Image>` with `blurDataURL`, `sizes`, lazy load, aspect-ratio 4/3
- Category + Sale/Rent badge (positioned absolute on image, top-left)
- Property type label (small, gray)
- Title (2-line clamp)
- Price (large, forest green or gold)
- Location (icon + text)
- Surface + Beds + Baths row
- Hover animation: Framer Motion `whileHover={{ y: -6 }}`
- CTA: "Voir Détails" button (ghost style)

**ServicesSection:**
- 5 service cards: Buying, Selling, Renting, Valuation, Investment
- Icon + title + 1-sentence description
- Alternating layout or uniform grid

**TestimonialsSection:**
- Client testimonials in a horizontal scrollable carousel
- Each: quote, client name, role, star rating (5 stars)
- Manual prev/next navigation

**StatisticsSection:**
- 4 large animated numbers: 24+ (years), 1000+ (clients), 500+ (properties), 5 (services)
- `AnimatedCounter`: GSAP `gsap.to({ val: 0 }, { val: target, duration: 2, ease: 'power1.out', onUpdate: () => setDisplay(Math.round(this.val)) })`
- Triggered by `ScrollTrigger` when section enters viewport

**CTASection:**
- Dark forest green background
- "Commencez Votre Recherche" headline
- Subtext + two buttons: "Voir les Propriétés" (gold) + "Nous Contacter" (outline white)

### Backend Tasks
- Ensure `GET /api/properties/featured` is working (from Phase 4)
- Ensure testimonials endpoint works (add `GET /api/testimonials` public endpoint if not already)

### Database Tasks
- Seed at least 6 featured properties and 3 testimonials

### API Tasks
- `GET /api/testimonials` — public endpoint returning active testimonials sorted by order

### Cloudinary Tasks
- Hero video uploaded to Cloudinary
- All seed property images uploaded to Cloudinary with transformation presets applied

### Animations
All animations detailed above. Summary:
- Hero video: slow zoom GSAP
- Hero typography: GSAP stagger timeline
- Hero search bar: GSAP delayed float-up
- Section headers: GSAP ScrollTrigger fade-up
- Property cards: GSAP batch stagger
- Statistics counters: GSAP number animation on scroll entry
- Hover on cards: Framer Motion

### Responsive Tasks
- Hero: search bar stacks vertically on mobile
- Featured properties: horizontal scroll on mobile, 3-col grid on `xl`
- Values: 2x2 grid on mobile, 4-col on desktop
- Services: 1-col mobile, 2-col tablet, 3-col desktop (with last row centered if 5 cards)
- Statistics: 2x2 grid on all sizes

### Accessibility Tasks
- Hero video: `aria-hidden="true"` (decorative)
- Property cards: full card as link (`<a>`) wrapping content for keyboard accessibility
- Statistics: not communicated as live updating — just rendered values
- Testimonials carousel: `role="region"`, `aria-label="Témoignages clients"`, keyboard navigation on prev/next

### SEO Tasks
- `generateMetadata` in `page.js`: full title, description, Open Graph image (static hero), Twitter card
- Agency `Organization` structured data in `<script type="application/ld+json">`

### Performance Tasks
- Hero video: `preload="none"` initially, swap to `preload="metadata"` on user interaction signal
- Featured properties: fetched server-side (no client waterfall)
- PropertyCard images: `loading="eager"` for first 3 (above fold), `loading="lazy"` for rest
- `AnimatedCounter`: uses `will-change: contents` only during animation

### Testing Checklist
- [ ] Hero video autoplays on load (test on mobile — iOS requires `muted + playsInline`)
- [ ] Hero video slow zoom animation starts on page load
- [ ] Hero typography stagger animation plays correctly
- [ ] Hero search bar submits and navigates to `/proprietes` with correct params
- [ ] Featured properties load from API (not placeholder data)
- [ ] PropertyCard hover animation plays at 60fps (check DevTools Performance tab)
- [ ] Statistics counters animate when scrolled into view
- [ ] Testimonials carousel prev/next works
- [ ] All sections have scroll-triggered reveal animations
- [ ] Home page renders correctly on mobile (375px)
- [ ] Home page renders correctly on tablet (768px)
- [ ] Open Graph metadata correct (verify with og debugger)
- [ ] No layout shift on font load (CLS near 0)

### Definition of Done
The home page is fully rendered, animated, and responsive. Featured properties load from live API. All animations play correctly. Lighthouse score: Performance > 90, Accessibility > 95, SEO = 100.

### Potential Risks
- Hero video + GSAP zoom may cause CLS if video dimensions not set — always set explicit `width/height` on video
- GSAP `SplitText` license requirements — if unavailable, implement manual character splitting with a utility function
- Testimonials section: if no testimonials in DB, section must gracefully not render

### Dependencies
- Phase 0–5 complete, Phase 4 API working

### Estimated Complexity
🔴 High

---

## PHASE 7 — Properties Listing Page

### Objective
Build the property discovery experience: a filterable, sortable, paginated grid/list of properties with a sticky search bar, active filter chips, and smooth loading states.

### Expected Result
Visitors can browse all published properties, filter by multiple criteria simultaneously, switch between grid and list view, sort results, and paginate. All filter state is reflected in the URL (shareable/bookmarkable). Loading states use skeleton cards.

### Files Created
- `frontend/app/(public)/proprietes/page.js`
- `frontend/features/properties/PropertyGrid.jsx`
- `frontend/features/properties/PropertyList.jsx`
- `frontend/features/properties/FilterPanel.jsx`
- `frontend/features/properties/SearchBar.jsx`
- `frontend/features/properties/SortSelect.jsx`
- `frontend/features/properties/ViewToggle.jsx`
- `frontend/features/properties/ActiveFilters.jsx`
- `frontend/features/properties/Pagination.jsx`
- `frontend/components/shared/ScrollReveal.jsx`
- `frontend/hooks/useDebounce.js`
- `frontend/lib/formatters.js`

### Frontend Tasks

**`app/(public)/proprietes/page.js` (Server Component):**
- Read all search params from `searchParams` prop
- Fetch properties from API server-side with those params
- `revalidate: 0` (no caching — always fresh for filters)
- Render grid/list with results; pass filter state to client filter components
- Export `generateMetadata` for the listing page

**URL-Based Filter State:**
- All filter values live in URL search params (`?listingType=sale&wilaya=Alger&page=2`)
- Client components read `useSearchParams()` and push updates via `useRouter().push()`
- Filter changes reset `page` to 1

**SearchBar (Client Component):**
- Text input with debounced (300ms) URL param update
- Clear button appears when input has value
- Magnifier icon (Lucide `Search`)
- Glass style: `backdrop-blur-md bg-white/80 border border-gray-100 rounded-2xl shadow-sm`

**FilterPanel (Client Component):**
- Mobile: opens as full-screen drawer (Framer Motion slide up)
- Desktop: rendered inline below search bar as collapsible panel
- Filters:
  - Wilaya: select (all 58 wilayas from constants)
  - Category: checkboxes (Villa, Apartment, Studio, Land, Commercial, Office, Luxury)
  - Listing type: toggle button group (Sale / Rent / Both)
  - Budget: dual range slider (min/max) — build custom or use `rc-slider`
  - Surface: dual range slider
  - Bedrooms: 1, 2, 3, 4+ button group
  - Bathrooms: 1, 2, 3+ button group
- "Appliquer" and "Réinitialiser" buttons

**ActiveFilters:**
- Renders chips for each active filter
- Each chip has an "×" to remove that filter
- "Effacer tout" link appears when any filters active

**SortSelect:**
- `<Select>` component from design system
- Options: Newest, Oldest, Price ↑, Price ↓, Surface ↑, Surface ↓

**ViewToggle:**
- Grid icon / List icon buttons
- Stores preference in `localStorage` for persistence

**PropertyGrid / PropertyList:**
- Grid: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6`
- List: single column, wider card with horizontal image
- Renders `PropertyCard` (grid) or `PropertyListItem` (list variant)
- Stagger reveal: GSAP batch on cards entering viewport

**Pagination:**
- Page number buttons + prev/next
- Shows current page, total pages
- Updates `?page=N` in URL
- Scrolls to top of results on page change (Lenis `scrollTo('#results')`)

**EmptyState:**
- Elegant illustration placeholder + "Aucune propriété trouvée" message
- "Modifier les filtres" CTA

**Loading State:**
- Show `Skeleton` cards while server re-fetches on filter change
- Use `Suspense` boundary around property grid

### Backend Tasks
- No new endpoints needed — `GET /api/properties` with all query params (Phase 4)
- Verify all filter combinations return correct results
- Add `GET /api/properties/meta` endpoint returning available wilayas (distinct values from published properties) — for populating dynamic wilaya filter

### Database Tasks
- Ensure seeded properties cover multiple wilayas, categories, listing types for filter testing

### API Tasks
- `GET /api/properties/meta` — returns `{ wilayas: ['Alger', 'Oran', ...] }` (distinct from published properties)

### Cloudinary Tasks
- None

### Animations
- Filter panel: Framer Motion slide-up drawer on mobile
- Property cards: GSAP batch stagger on page change
- Filter chip add/remove: Framer Motion `layout` prop (smooth reflow)
- Pagination: simple fade on page change (`AnimatePresence` on grid)
- Search bar focus: Framer Motion scale `1 → 1.01` on focus

### Responsive Tasks
- On mobile: filter panel is a full-screen drawer activated by a "Filtrer" button
- On desktop: filter panel renders in a collapsible sidebar or top expandable row
- View toggle hidden on mobile (always shows grid)
- Pagination: show fewer page numbers on mobile (current ± 1)

### Accessibility Tasks
- `<main id="main-content">` wraps page content (target of skip link)
- Filter panel drawer: `role="dialog"`, `aria-modal`, focus trap
- Active filters: each chip has `aria-label="Supprimer le filtre: {name}"`
- Sort select: properly labeled with visually hidden `<label>` or `aria-label`
- Pagination: `<nav aria-label="Pagination">`, current page has `aria-current="page"`

### SEO Tasks
- `generateMetadata` for listing page: title includes filter summary if active (e.g. "Villas à vendre à Alger")
- `robots: { index: true }` for clean filter-less page; `noindex` when many filters active (prevent duplicate content)
- `<link rel="canonical">` pointing to clean URL when filters don't change canonical content

### Performance Tasks
- Debounce search input (300ms) to avoid excessive navigation
- Server Component data fetch — no client waterfall
- Skeleton loading — prevents layout shift during navigation

### Testing Checklist
- [ ] Properties load on initial page visit
- [ ] Filtering by wilaya updates URL and results
- [ ] Filtering by listing type updates results
- [ ] Multiple filters combine correctly (AND logic)
- [ ] Active filters display correctly and can be removed individually
- [ ] "Réinitialiser" clears all filters and URL params
- [ ] Sorting by price ascending/descending works
- [ ] Grid/list view toggle switches layout
- [ ] Pagination navigates correctly and scrolls to top
- [ ] Empty state appears when no results match
- [ ] Skeleton cards appear during loading
- [ ] Search text input filters by title/description
- [ ] Page is bookmarkable (sharing URL with filters preserves state)
- [ ] Mobile filter drawer opens, works, and closes

### Definition of Done
All filter combinations work correctly. URL reflects all filter state. Loading states are graceful. Grid and list views function. Pagination works. Empty state appears correctly.

### Potential Risks
- URL length limit if many filters active — use concise param names
- Dual range slider accessibility — ensure keyboard control and ARIA values

### Dependencies
- Phase 0–5 complete, Phase 4 API working

### Estimated Complexity
🔴 High

---

## PHASE 8 — Property Detail Page

### Objective
Build the individual property showcase page — the most content-rich page in the application. This page must communicate complete property information, evoke desire through excellent imagery, and convert visitors into leads through a contact sidebar.

### Expected Result
A complete property detail page with: full-width gallery with lightbox, specifications grid, features list, video player (if available), location section, sticky agent contact sidebar with contact form, and related properties section.

### Files Created
- `frontend/app/(public)/proprietes/[slug]/page.js`
- `frontend/features/property-detail/PropertyGallery.jsx`
- `frontend/features/property-detail/PropertyHeader.jsx`
- `frontend/features/property-detail/PropertySpecifications.jsx`
- `frontend/features/property-detail/PropertyFeatures.jsx`
- `frontend/features/property-detail/PropertyDescription.jsx`
- `frontend/features/property-detail/PropertyLocation.jsx`
- `frontend/features/property-detail/AgentContactCard.jsx`
- `frontend/features/property-detail/VisitRequestForm.jsx`
- `frontend/features/property-detail/RelatedProperties.jsx`
- `frontend/components/shared/ImageGallery.jsx`
- `frontend/components/shared/VideoPlayer.jsx`
- `frontend/components/shared/MapPlaceholder.jsx`
- `frontend/components/shared/ContactForm.jsx`
- `frontend/services/contact.service.js`
- `frontend/actions/contact.actions.js`
- `frontend/app/(public)/proprietes/[slug]/loading.js`
- `frontend/app/(public)/proprietes/[slug]/not-found.js`

### Frontend Tasks

**`[slug]/page.js` (Server Component):**
- Fetch property by slug from API: `fetch(.../properties/${slug}, { next: { revalidate: 3600 } })`
- If property not found (404 from API), call `notFound()` from `next/navigation`
- Pass property data to Client Component sections
- `generateStaticParams()`: fetch all published property slugs for static generation
- `generateMetadata()`: use property title, description, heroImage for all meta/OG tags
- Add `RealEstateListing` structured data in `<script type="application/ld+json">`
- Breadcrumbs component: Home → Propriétés → {Property Title}

**PropertyGallery (Client Component):**
- Full-width hero image (aspect ratio 16/7 on desktop, 4/3 on mobile)
- Thumbnail strip below: first 5 images shown, "voir plus" if more
- Click on image: opens fullscreen lightbox (Framer Motion `AnimatePresence` modal)
- Lightbox: dark backdrop, centered large image, prev/next arrows, keyboard navigation (←→ Escape), image count indicator
- Parallax on hero image: GSAP `ScrollTrigger` `y: '20%'` as user scrolls down

**PropertyHeader:**
- Breadcrumbs (`<nav>` with schema)
- Badges: Category, ListingType (Sale/Rent), Status (Sold/Reserved if applicable)
- H1: Property title (serif)
- Price: large, formatted (DZD with thousand separators)
- Location: Wilaya + Commune with map-pin icon

**PropertySpecifications:**
- 2-column grid of spec items
- Each item: icon + label + value
- Items: Surface, Living Area, Land Area, Bedrooms, Bathrooms, Living Rooms, Kitchen, Garage, Parking, Floors, Year Built
- Only render items that have values (not null/0)

**PropertyFeatures:**
- Horizontal wrap of `FeatureTag` chips
- Each tag: checkmark icon + label (Swimming Pool, Garden, Terrace, etc.)
- Only render features set to `true`

**PropertyDescription:**
- Prose block with the full description
- "Voir plus" expand if text is long (line-clamp initially)

**VideoPlayer (Client Component):**
- Renders only if `property.media.video.url` exists
- Custom styled `<video>` element with play button overlay
- IntersectionObserver: sets `src` attribute only when player enters viewport
- Controls: play/pause, volume, fullscreen, progress bar
- Poster from `property.media.video.poster`

**PropertyLocation:**
- Address display
- `MapPlaceholder`: a styled card reading "Localisation disponible sur rendez-vous" with a subtle map-pin illustration — actual map integration is a future feature
- Phase 12 note: Google Maps embed as a future enhancement

**AgentContactCard (sticky sidebar on desktop):**
- Agency branding (LA FORÊT logo, phone number)
- 3 action buttons: Call (`tel:` link), WhatsApp (`wa.me/` link with pre-filled message), "Demander info" (opens VisitRequestForm inline)
- Sticky: `position: sticky, top: 100px` on desktop

**VisitRequestForm:**
- Fields: Name, Phone, Email, Preferred Date (optional), Message
- Server Action `contact.actions.js` → `POST /api/contact/visit`
- Success state: animated checkmark + thank you message
- Error state: error message with retry

**RelatedProperties:**
- Fetch 3 properties with same category or listing type (same API, different params)
- Render 3 `PropertyCard` components
- Animated stagger reveal

### Backend Tasks
- `GET /api/contact` and `POST /api/contact/visit` from Phase 4 (verify working)
- Add `GET /api/properties/related/:slug` endpoint: returns 3 properties with same category, same listing type, published, excluding current property

### Database Tasks
- No new schema changes

### API Tasks
- `GET /api/properties/related/:slug` — returns 3 related published properties

### Cloudinary Tasks
- Image gallery uses Cloudinary URLs with responsive transformation params
- Lightbox uses large-format URL (2400px width)
- Thumbnails use small format (300px)

### Animations
- Gallery hero image: GSAP parallax on scroll (y offset)
- Lightbox open/close: Framer Motion scale+opacity `AnimatePresence`
- Image transition in lightbox: Framer Motion `x: ±100, opacity: 0` slide
- Property header: staggered fade-up on page load (GSAP timeline)
- Specification items: stagger reveal on scroll entry
- Related properties: GSAP batch stagger

### Responsive Tasks
- Gallery: full-width image, thumbnail strip scrollable horizontally on mobile
- Spec grid: 1-col on mobile, 2-col on tablet+
- Main layout: stacked on mobile/tablet (no sidebar), sticky sidebar only on `lg+`
- Agent card: at bottom of page on mobile, sticky sidebar on desktop
- Lightbox: full screen on mobile

### Accessibility Tasks
- Gallery: `role="region"`, `aria-label="Galerie de photos"`, images have descriptive `alt`
- Lightbox: `role="dialog"`, `aria-modal`, focus trap, Escape closes
- Video: proper controls, no autoplay (only on explicit play action)
- Contact form: full label/input associations, `aria-required`, success/error live regions

### SEO Tasks
- `generateMetadata` with full OG + Twitter card using property hero image Cloudinary URL
- `RealEstateListing` schema with price, address, number of rooms, images, description
- `BreadcrumbList` schema
- Property page is a prime SEO landing page — ensure H1 = property title, canonical URL set
- `generateStaticParams` pre-renders all published property slugs at build time (ISR fallback for newly added)

### Performance Tasks
- Gallery images: `loading="eager"` for hero only, `loading="lazy"` for thumbnails
- Lightbox images: loaded lazily, only current ± 1 loaded in advance
- Video: `IntersectionObserver` delays src assignment — does not load video file until visible
- Related properties: fetched server-side on same request
- Page pre-rendered at build time via `generateStaticParams` — zero server load on visit

### Testing Checklist
- [ ] Property detail page loads for a valid slug
- [ ] `not-found.js` renders for invalid slug
- [ ] Gallery shows hero image and thumbnail strip
- [ ] Clicking thumbnail updates main image
- [ ] Fullscreen lightbox opens on image click
- [ ] Lightbox navigation works (prev/next, keyboard)
- [ ] Lightbox closes on Escape and backdrop click
- [ ] Video player loads only when scrolled into view
- [ ] Video plays/pauses correctly
- [ ] Agent contact card sticks on desktop scroll
- [ ] Visit request form submits successfully (check DB for new lead)
- [ ] Success state shows after form submission
- [ ] Phone link works: `tel:` opens dialer
- [ ] WhatsApp link opens WhatsApp with pre-filled message
- [ ] Related properties show 3 cards
- [ ] All meta tags correct in `<head>` (verify with DevTools)
- [ ] Structured data valid (test with Google Rich Results Test)

### Definition of Done
Property detail page renders with real data. Gallery and lightbox work. Contact form creates leads in DB. SEO metadata is complete and valid. ISR generates static pages at build.

### Potential Risks
- Property with no hero image — always render a graceful placeholder
- ISR `generateStaticParams` may time out on large property counts — paginate the slug fetch

### Dependencies
- Phase 0–5 complete, Phase 4 API working

### Estimated Complexity
🔴 High

---

## PHASE 9 — Supporting Public Pages (About, Services, Contact)

### Objective
Build the three remaining public pages. These are primarily static content pages with elegant presentation and contact functionality.

### Expected Result
Three complete, animated pages: About (agency history, team, values), Services (detailed service descriptions), Contact (form, business info, WhatsApp).

### Files Created
- `frontend/app/(public)/a-propos/page.js`
- `frontend/app/(public)/services/page.js`
- `frontend/app/(public)/contact/page.js`
- `frontend/features/about/HeroAbout.jsx`
- `frontend/features/about/HistoryTimeline.jsx`
- `frontend/features/about/MissionSection.jsx`
- `frontend/features/about/WhyUsSection.jsx`
- `frontend/features/services/ServicesHero.jsx`
- `frontend/features/services/ServiceDetailCard.jsx`
- `frontend/features/contact/ContactHero.jsx`
- `frontend/features/contact/ContactDetails.jsx`
- `frontend/features/contact/ContactFormSection.jsx`
- `frontend/features/contact/BusinessHours.jsx`

### Frontend Tasks

**About Page:**
- Hero: "Notre Histoire" heading, short tagline, hero background (static forest green gradient or photo)
- History section: timeline from 2002 to present with key milestones. Timeline line down center (desktop), left (mobile), each milestone has year + description
- Mission/Vision section: two side-by-side cards with elegant typography
- Values: same 4 values as home, but expanded with longer descriptions
- "Pourquoi Nous Choisir" section: 3–4 differentiators with icons and text
- Team section: placeholder cards (photo + name + role) — minimal, no real data needed for MVP

**Services Page:**
- Hero: "Nos Services" heading
- 5 service detail cards (one per service):
  - Achat (Buying)
  - Vente (Selling)
  - Location (Renting)
  - Estimation Immobilière (Valuation)
  - Conseil en Investissement (Investment consulting)
- Each card: icon, title, description (3–4 sentences), list of what's included, CTA "En Savoir Plus" → Contact

**Contact Page:**
- Hero: "Contactez-Nous" heading
- Two-column layout: left = contact details + hours, right = form
- Contact details: Phone, Email, WhatsApp, Address (Algiers)
- Business hours: table-like display M–F 9:00–17:00, Sat 9:00–13:00
- Contact form: Name, Phone, Email, Subject (select), Message, Submit
- `POST /api/contact` on submit
- Success/error states
- WhatsApp floating button: bottom-right of page

### Backend Tasks
- `POST /api/contact` already exists (Phase 4)
- Add `subject` field to Lead model (or handle in message)

### Database Tasks
- No new schemas

### API Tasks
- None new

### Cloudinary Tasks
- None

### Animations
- All three pages share the same `ScrollReveal` scroll-triggered fade-up pattern
- About: history timeline items animate in sequence as user scrolls
- Services: service cards stagger in
- Contact: form fields fade in on page load (short delay stagger)

### Responsive Tasks
- About timeline: horizontal (centered) on desktop, vertical left-aligned on mobile
- Services: 2-col grid on tablet, 1-col on mobile
- Contact: stacked (form below details) on mobile, 2-col on desktop

### Accessibility Tasks
- Timeline: `role="list"` + `role="listitem"` for each milestone; dates communicate history
- Contact form: full label association, submit state announced via `aria-live`
- Business hours: consider `<table>` with caption for structured hours

### SEO Tasks
- Static `generateMetadata` for all three pages
- About page: `Organization` structured data
- Services page: `Service` schema items
- Contact page: `LocalBusiness` structured data with address, hours, phone

### Performance Tasks
- All three pages are `cache: 'force-cache'` — no runtime data fetching (fully static)
- Pages are SSG at build time: fastest possible load

### Testing Checklist
- [ ] About page renders all sections
- [ ] History timeline renders correctly at all breakpoints
- [ ] Services page renders all 5 service cards
- [ ] Contact form submits successfully
- [ ] Contact form shows success state
- [ ] Contact form shows error state on network failure
- [ ] Business hours display correctly
- [ ] WhatsApp button is visible and links correctly
- [ ] All three pages fully responsive on mobile
- [ ] Scroll animations trigger correctly

### Definition of Done
All three pages are complete, responsive, animated, and accessible. Contact form creates leads in the DB successfully.

### Potential Risks
- None significant — these are static content pages

### Dependencies
- Phase 0–5 complete

### Estimated Complexity
🟡 Medium

---

## PHASE 10 — Admin Dashboard

### Objective
Build the complete admin interface: a private dashboard for managing properties, uploading media, viewing leads, and monitoring basic statistics. The admin experience prioritizes clarity and efficiency over aesthetics, though it maintains brand consistency.

### Expected Result
A logged-in admin can: view dashboard stats, see a paginated list of all properties, create new properties with full specifications and gallery upload, edit existing properties, change status, toggle featured, view and manage leads. The interface is fast, keyboard-friendly, and error-tolerant.

### Files Created
- `frontend/app/(admin)/admin/dashboard/page.js`
- `frontend/app/(admin)/admin/proprietes/page.js`
- `frontend/app/(admin)/admin/proprietes/nouvelle/page.js`
- `frontend/app/(admin)/admin/proprietes/[id]/modifier/page.js`
- `frontend/app/(admin)/admin/media/page.js`
- `frontend/app/(admin)/admin/parametres/page.js`
- `frontend/app/(admin)/layout.js`
- `frontend/features/admin/dashboard/StatsCard.jsx`
- `frontend/features/admin/dashboard/RecentLeads.jsx`
- `frontend/features/admin/properties/PropertyTable.jsx`
- `frontend/features/admin/properties/PropertyTableRow.jsx`
- `frontend/features/admin/properties/PropertyForm.jsx`
- `frontend/features/admin/properties/PropertyFormSections/*.jsx` (6 files)
- `frontend/features/admin/media/MediaLibrary.jsx`
- `frontend/features/admin/media/UploadZone.jsx`
- `frontend/features/admin/media/MediaGrid.jsx`
- `frontend/store/adminStore.js` (complete Zustand store)
- `frontend/hooks/useAdminAuth.js`
- `frontend/components/shared/Toast.jsx`
- `frontend/hooks/useToast.js`

### Frontend Tasks

**Admin Layout:**
- Left sidebar (fixed, `w-64`): logo, nav links (Dashboard, Propriétés, Médias, Paramètres), logout button at bottom
- Top bar: page title (dynamic), admin name + avatar
- Main content area: scrollable, `p-6 md:p-8`
- No Lenis smooth scrolling in admin (native scroll preferred for form performance)
- No page transitions (fast UX preferred)

**Dashboard Page:**
- 4 `StatsCard` components: Total Properties, Published, Draft, New Leads (this month)
- `RecentLeads` table: last 5 leads with name, property, date, status, action
- Quick links: "Ajouter une propriété", "Voir les propriétés"

**Properties List Page:**
- Search input (filter by title)
- Status filter tabs: All | Published | Draft | Sold | Reserved
- `PropertyTable`: sortable columns (title, price, status, date, featured)
- `PropertyTableRow`: title (with thumbnail), status badge, listing type, price, date, action menu (Edit, Preview, Change Status, Delete)
- Pagination (20 per page)
- "Nouvelle Propriété" button (top right, gold)

**Property Form (Create + Edit):**
- Multi-section form with a section navigator (sticky left panel on desktop, accordion on mobile)
- Section 1 — General: Title, Slug (auto-generated, editable), Listing Type toggle, Category select, Status select, Featured toggle
- Section 2 — Description: Rich textarea (plain text only for MVP, no WYSIWYG)
- Section 3 — Specifications: all numeric fields in 3-col grid (Surface, Bedrooms, Bathrooms, etc.)
- Section 4 — Features: checkbox grid for all boolean features (Pool, Garden, etc.)
- Section 5 — Location: Wilaya select, Commune input, Address input, Lat/Lng inputs
- Section 6 — Media: hero image upload + gallery drag-and-drop, video upload
- Section 7 — SEO: Meta title (char count), meta description (char count), keywords (tag input)
- Form state managed by React `useState` (complex form — no external lib for MVP)
- Auto-save draft: `useEffect` debounced save to localStorage on form change (prevents loss on refresh)
- Submit: calls `createProperty` or `updateProperty` from `adminStore`

**Media Section (in Property Form):**
- `UploadZone`: drag-and-drop area + file input fallback
- On drop: call `POST /api/media/image` for each file, show upload progress per file
- Uploaded images display in `MediaGrid`: thumbnail, order handle, delete button
- `MediaGrid`: drag to reorder (using `@dnd-kit/core` or plain dragover events)
- Hero image: radio selection among uploaded images
- Video upload: separate upload zone

**Admin Stats endpoint wired to dashboard**

**Zustand Admin Store (complete):**
- `admin` state, `setAdmin`, `clearAdmin`
- `properties`, `fetchProperties`, `createProperty`, `updateProperty`, `deleteProperty`, `updateStatus`, `toggleFeatured`
- `currentProperty`, `setCurrentProperty`
- `leads`, `fetchLeads`, `updateLeadStatus`
- `stats`, `fetchStats`
- `isLoading`, `error`, `pagination`
- `toast` — simple toast state (message, type, visible)

**Toast System:**
- `ToastProvider` in root layout (admin)
- `useToast()` hook: `toast.success(msg)`, `toast.error(msg)`, `toast.info(msg)`
- Toast component: Framer Motion slide-in from top-right

### Backend Tasks
- All property CRUD endpoints from Phase 4
- `GET /api/stats/dashboard` — dashboard stats endpoint
- `GET /api/contact/leads` — paginated leads list with filters
- `PATCH /api/contact/leads/:id/status` — update lead status
- Verify all media endpoints working
- Add `GET /api/properties/admin` — returns ALL properties regardless of status (protected, for admin list)

### Database Tasks
- No new schemas

### API Tasks
- `GET /api/properties/admin` — all properties (all statuses) for admin list view
- `GET /api/stats/dashboard`
- `GET /api/contact/leads`
- `PATCH /api/contact/leads/:id/status`

### Cloudinary Tasks
- Image upload flow fully integrated through form
- Drag-to-reorder gallery: order saved in property document
- Delete image: calls `DELETE /api/media/:publicId` then removes from form state

### Animations
- Minimal — admin is a functional tool
- Toast notifications: Framer Motion slide + fade
- Form section accordion (mobile): Framer Motion height animation
- Table row delete: Framer Motion exit animation (row slides up and fades)

### Responsive Tasks
- Admin is primarily a desktop tool — optimize for 1024px+
- At `md` (768px): sidebar collapses to icon-only rail with tooltips
- At `sm` (<768px): sidebar becomes a top drawer (hamburger)
- Property form: section nav becomes accordion on mobile
- Tables: horizontal scroll on mobile

### Accessibility Tasks
- Form: all inputs labeled, required fields marked `aria-required`
- File upload zone: keyboard accessible, `role="button"`, drag events have keyboard alternative
- Toast: `role="alert"`, `aria-live="assertive"`
- Table: proper `<th>` headers, `scope="col"`
- Delete confirmation: dialog before executing deletion

### SEO Tasks
- All admin pages: `export const metadata = { robots: { index: false, follow: false } }`

### Performance Tasks
- Admin is not performance-critical for end users
- Image upload: show progress indicators to prevent perceived slowness
- Large property lists: server-side pagination (not front-end filtering)

### Testing Checklist
- [ ] Admin can log in and see dashboard
- [ ] Dashboard stats reflect actual DB counts
- [ ] Property list shows all properties with correct statuses
- [ ] Search/filter in property list works
- [ ] "Nouvelle Propriété" navigates to create form
- [ ] Create form: all sections save correctly
- [ ] Image upload works: file uploaded to Cloudinary, URL stored
- [ ] Gallery drag-to-reorder updates order in form state
- [ ] Form slug auto-generates from title
- [ ] Form auto-saves to localStorage
- [ ] Editing existing property pre-fills all form fields
- [ ] Status change (publish/unpublish) works
- [ ] Featured toggle works
- [ ] Delete shows confirmation and removes from list
- [ ] Leads list shows recent submissions
- [ ] Lead status can be updated
- [ ] Toast notification appears on all actions
- [ ] Admin logout clears session

### Definition of Done
Admin can perform all CRUD operations on properties with full media management. Dashboard stats are accurate. Lead management works. All form sections save correctly.

### Potential Risks
- Complex multi-section form state management — keep all state in a single `useState` object to avoid sync issues
- Concurrent image uploads: track each upload with a unique key and individual loading state
- DnD reorder library compatibility with Next.js App Router — `@dnd-kit/core` is preferred (no jQuery dependency)

### Dependencies
- All previous phases complete

### Estimated Complexity
🔴 Very High

---

## PHASE 11 — SEO, Performance & Accessibility Polish

### Objective
This phase elevates the project from functional to production-grade by implementing all remaining SEO, performance optimizations, and accessibility improvements. It is a comprehensive audit-and-fix phase.

### Expected Result
- Lighthouse score: Performance 95+, Accessibility 100, Best Practices 100, SEO 100
- All structured data validates in Google Rich Results Test
- All images optimized with correct formats and sizes
- Zero accessibility violations in axe DevTools scan

### Files Created
- `frontend/app/sitemap.js`
- `frontend/app/robots.js`
- `frontend/app/manifest.json`
- `frontend/public/og/home.jpg` (static OG image)
- Schema markup in all relevant pages

### Frontend Tasks

**Sitemap (`app/sitemap.js`):**
- Static routes: `/`, `/proprietes`, `/a-propos`, `/services`, `/contact`
- Dynamic routes: fetch all published property slugs from API, map to `/proprietes/[slug]` entries
- Set `lastModified`, `changeFrequency`, `priority` per route type

**Robots (`app/robots.js`):**
```
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://laforet-immo.dz/sitemap.xml
```

**Structured Data review:**
- Home: `Organization` with name, url, logo, contactPoint, sameAs (social)
- Property detail: `RealEstateListing` with all required fields, `BreadcrumbList`
- About: `AboutPage` + `Organization` with foundingDate: 2002
- Services: `Service` for each service offering
- Contact: `LocalBusiness` with address, phone, hours

**Image Audit:**
- Every `<Image>` must have meaningful `alt` text — audit all instances
- All images must have `sizes` prop configured correctly
- All property images served from Cloudinary with `f_auto,q_auto` in URL

**Accessibility Audit (axe DevTools):**
- Run full scan on all 6 public pages
- Fix all violations (typically: color contrast, missing labels, focus order)
- Add `aria-label` to all icon-only buttons
- Verify all modals have correct `aria-` attributes
- Ensure all form error messages are announced via `aria-live`
- Verify logical heading hierarchy (one H1 per page, logical H2→H3 nesting)
- Add `lang` attribute to root HTML element (`lang="fr"`)

**`prefers-reduced-motion` audit:**
- Wrap all GSAP animations in `matchMedia('(prefers-reduced-motion: reduce)')` check
- Wrap all Framer Motion animations in `useReducedMotion()` check

**Manifest:**
- Progressive Web App manifest with app name, icons, theme color (forest green), background color white

**Performance:**
- Audit Network tab: identify and remove unused JavaScript
- Verify no render-blocking resources
- Add `<link rel="preconnect">` for Cloudinary domain and Google Fonts
- Add `<link rel="dns-prefetch">` for API domain
- Verify Core Web Vitals:
  - LCP (Largest Contentful Paint): hero image should be < 2.5s — ensure hero image uses `priority` prop in Next.js `<Image>`
  - CLS (Cumulative Layout Shift): all images have explicit `width`/`height` or `aspect-ratio`, all fonts use `font-display: swap`
  - INP (Interaction to Next Paint): no long tasks on main thread

### Backend Tasks
- Enable gzip compression on Express (`compression` middleware)
- Set `Cache-Control` headers on public API responses:
  - `/api/properties/featured`: `Cache-Control: s-maxage=60, stale-while-revalidate`
  - `/api/properties/:slug`: `Cache-Control: s-maxage=3600, stale-while-revalidate`
- Set `ETag` headers on GET responses (Express enables by default)

### Database Tasks
- Review and optimize slow queries using Atlas Performance Advisor

### API Tasks
- None new

### Cloudinary Tasks
- Verify all images use `f_auto` (auto-format) — critical for AVIF/WebP delivery
- Audit image sizes — ensure no oversized images loading

### Animations
- `prefers-reduced-motion` compliance for all animations

### Responsive Tasks
- Final cross-device test: iPhone SE (375px), iPhone Pro (390px), iPad (768px), iPad Pro (1024px), Desktop 1440px
- Test on actual iOS Safari (not just Chrome mobile emulation)

### Accessibility Tasks
- Full axe scan on all pages and fix all issues
- Screen reader test (VoiceOver on macOS, NVDA on Windows)
- Keyboard-only navigation test on all pages

### SEO Tasks
- Validate sitemap at `/sitemap.xml`
- Validate robots at `/robots.txt`
- Test all pages in Google Rich Results Test
- Test all OG images in social share preview tools
- Submit sitemap to Google Search Console

### Performance Tasks
- Run Lighthouse on all 6 public pages
- Fix all issues until targets are met
- Run `next build && next start` and test production build locally

### Testing Checklist
- [ ] `/sitemap.xml` returns all expected URLs
- [ ] `/robots.txt` disallows `/admin/`
- [ ] Rich Results Test validates Property structured data
- [ ] axe DevTools: 0 violations on all pages
- [ ] Keyboard-only navigation works on all pages
- [ ] `prefers-reduced-motion: reduce` disables all animations
- [ ] LCP < 2.5s on home page
- [ ] CLS < 0.1 on all pages
- [ ] Lighthouse Performance > 90 on all pages (mobile)
- [ ] Lighthouse Accessibility = 100 on all pages
- [ ] Lighthouse SEO = 100 on all pages
- [ ] OG images display correctly when URL shared on WhatsApp / iMessage

### Definition of Done
Lighthouse targets met. All accessibility violations resolved. Structured data valid. Sitemap and robots configured. `prefers-reduced-motion` respected.

### Potential Risks
- Lighthouse scores can vary between runs — target median of 3 runs
- iOS Safari animation performance issues require testing on real device

### Dependencies
- All previous phases complete

### Estimated Complexity
🟡 Medium-High

---

## PHASE 12 — QA, Security Audit & Deployment

### Objective
Final quality assurance, full security review, production environment configuration, and live deployment. This is the gate phase before the site goes live.

### Expected Result
The application is deployed to production, fully functional, secure, and monitored.

### Files Created
- `frontend/Dockerfile` (optional — if Vercel config insufficient)
- `backend/Dockerfile`
- `backend/.github/workflows/deploy.yml` (GitHub Actions)
- `README.md` (complete setup and deployment docs)

### Frontend Tasks
- Run production build: `npm run build` — fix all build errors
- Set all Vercel environment variables
- Configure Vercel project settings: custom domain, HTTPS, automatic deployments
- Set up Vercel Preview deployment for `dev` branch
- Run final end-to-end test suite on staging URL

### Backend Tasks
- Run `npm run start` on Railway
- Set all Railway environment variables
- Configure custom domain for API (`api.laforet-immo.dz`)
- Verify CORS correctly configured for production domains
- Run security checklist (below)

**Security Checklist:**
- [ ] JWT secret is at least 64 random characters (use `openssl rand -hex 64`)
- [ ] bcrypt rounds = 12
- [ ] All `.env` files are in `.gitignore` and NOT committed
- [ ] `httpOnly: true`, `secure: true`, `sameSite: 'strict'` on auth cookie
- [ ] All admin routes protected by middleware on both frontend and backend
- [ ] Rate limiting active and tested
- [ ] Helmet headers visible in production response
- [ ] Cloudinary upload preset is signed (not unsigned)
- [ ] MongoDB Atlas: disable direct public access; whitelist only Railway IPs
- [ ] No stack traces returned in production error responses
- [ ] `NODE_ENV=production` set on server
- [ ] Input validation on all POST/PUT/PATCH endpoints

### Database Tasks
- Take Atlas backup snapshot before launch
- Enable Atlas auto-backup (daily)
- Review Atlas alerts (disk, CPU, connections)
- Remove dev/seed data from production database
- Create production admin account via seed script

### API Tasks
- Final test of all endpoints in production environment
- Verify API domain resolves correctly

### Cloudinary Tasks
- Set up production Cloudinary folder (`laforet-prod/`)
- Move seed images to production folder or re-upload
- Set up usage alerts in Cloudinary dashboard

### Animations
- Final animation smoothness test on production (not dev server)
- Verify GSAP license (if using premium plugins)

### Responsive Tasks
- Full cross-device test on production URL
- Test on Samsung Galaxy S21 (Android Chrome) and iPhone 13 (iOS Safari)

### Accessibility Tasks
- Final axe scan on production URL
- Submit for WCAG 2.1 AA self-assessment

### SEO Tasks
- Submit sitemap to Google Search Console
- Set up Vercel Analytics or Google Analytics (if required)
- Verify Google can crawl site via Search Console URL Inspection

### Performance Tasks
- Run Lighthouse on production URL (not localhost)
- Document final scores
- Set up uptime monitoring (UptimeRobot or Better Uptime — free tier)

### Testing Checklist

**Smoke Tests (must pass before launch):**
- [ ] Home page loads in < 3s on 4G connection
- [ ] Property listing loads and filters work
- [ ] Property detail page loads with correct data
- [ ] Contact form submits and creates lead in production DB
- [ ] Visit request form on property page works
- [ ] Admin login works in production
- [ ] Admin can create a property and publish it
- [ ] Published property appears on public listing
- [ ] Admin can upload images and they appear on Cloudinary
- [ ] Admin can log out
- [ ] WhatsApp button opens WhatsApp correctly
- [ ] Phone button opens dialer on mobile
- [ ] All navigation links work
- [ ] 404 page appears for invalid URLs
- [ ] HTTPS is enforced (HTTP redirects to HTTPS)
- [ ] API health endpoint responds

### Definition of Done
Application is live at production URL. All smoke tests pass. Security checklist complete. Monitoring active. Database backed up. No critical bugs.

### Potential Risks
- CORS issue when switching from localhost to production domain — test early in staging
- Cloudinary quota limit if many high-res images — monitor usage dashboard
- Railway sleep on free tier — upgrade to paid if needed for always-on

### Dependencies
- All phases 0–11 complete

### Estimated Complexity
🟡 Medium

---

## APPENDIX A — Dependency Graph

```
Phase 0 (Foundation)
   └── Phase 1 (Design System)
           └── Phase 5 (Frontend Shell)
   └── Phase 2 (Backend Infra)
           └── Phase 3 (Auth)
                   └── Phase 4 (Properties API)
                           └── Phase 7 (Listing Page)
                           └── Phase 8 (Detail Page)
                           └── Phase 10 (Admin Dashboard)

Phase 5 (Shell) + Phase 1 (Design System)
   └── Phase 6 (Home Page) — depends on Phase 4 for featured properties
   └── Phase 7 (Listing Page)
   └── Phase 8 (Detail Page)
   └── Phase 9 (Static Pages)
   └── Phase 10 (Admin)

Phases 6, 7, 8, 9, 10 all complete
   └── Phase 11 (SEO + Performance + A11y)
           └── Phase 12 (QA + Deployment)
```

---

## APPENDIX B — Technology Versions (Locked)

| Package | Version | Notes |
|---|---|---|
| next | 16.x | App Router, use latest stable |
| react | 19.x | Concurrent mode |
| tailwindcss | 3.4.x | Stable JIT engine |
| gsap | 3.12.x | Latest stable |
| lenis | 1.1.x | Smooth scroll |
| framer-motion | 11.x | Latest stable |
| zustand | 4.x | State management |
| axios | 1.7.x | HTTP client |
| lucide-react | 0.400+ | Icons |
| express | 4.21.x | Web framework |
| mongoose | 8.x | ODM |
| jsonwebtoken | 9.x | JWT |
| bcryptjs | 2.4.x | Password hashing |
| joi | 17.x | Validation |
| multer | 1.4.x | File uploads |
| cloudinary | 2.x | Media SDK |
| helmet | 7.x | Security headers |
| morgan | 1.10.x | HTTP logger |
| express-rate-limit | 7.x | Rate limiting |
| cors | 2.8.x | CORS middleware |

---

## APPENDIX C — Glossary

| Term | Definition in this project |
|---|---|
| **ISR** | Incremental Static Regeneration — Next.js feature that rebuilds pages at a defined interval |
| **Glass Morphism / Liquid Glass** | UI style: `backdrop-blur` + semi-transparent background + subtle border |
| **Slug** | URL-safe version of property title, e.g. "villa-avec-piscine-alger-hydra" |
| **Lead** | A contact form submission or visit request from a potential client |
| **PublicId** | Cloudinary's unique identifier for an uploaded asset |
| **BlurPlaceholder** | A tiny (30px) base64-encoded blurred image used as `blurDataURL` in `<Image>` |
| **Soft Delete** | Setting `status: 'hidden'` instead of removing a document from MongoDB |
| **Stagger** | Animation technique: applying the same animation to multiple elements with a sequential time delay |
| **ScrollTrigger** | GSAP plugin that triggers animations based on scroll position |

---

*End of Software Implementation Plan — LA FORÊT Agence Immobilière*  
*Document prepared by: Outfoxed.Dev Senior Architecture Team*  
*Ready for handoff to: Antigravity AI Coding Assistant*  
*Begin with: Phase 0*
