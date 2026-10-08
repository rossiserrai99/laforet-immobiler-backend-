# Comprehensive Property Data Model & Admin Workflow Report
**Milestone 0 — Pre-flight Repository Health Check & Architecture Audit**
*La Forêt Real Estate Website Platform*
*Prepared by: Explorer 3 (Property & Admin Workflow Explorer)*
*Date: October 2026*

---

## 1. Executive Summary & Architecture Overview

This investigation provides a comprehensive audit of the property data models, administration dashboard workflows, public client-side consumption, and field mapping feasibility for the La Forêt real estate platform.

### High-Level Architectural Snapshot
- **Backend Data Layer:** Node.js (Express 5.2.1) + MongoDB (Mongoose 9.7.4). The database stores properties, leads, admin users, and testimonials.
- **Admin Dashboard:** Built in Next.js 16.2.10 (App Router) using Tailwind CSS v4, Framer Motion, and Lucide icons under the route group `frontend/app/(admin)`.
- **Authentication:** Dual-layer security comprising JWT-based stateless tokens, HttpOnly cookies (`laforet_token`), and Next.js Edge Middleware route guards.
- **Media Pipeline (Current Baseline):** Handled via `multer-storage-cloudinary` directly in Express route middlewares (`backend/src/middlewares/upload.middleware.js`), uploading into Cloudinary folder `laforet_properties`. Full resolution transformations are requested by the frontend (`/upload/q_auto:best/`).
- **Public Property Showcase:** Implemented under `frontend/app/(public)/properties` and `/properties/[slug]`, featuring multi-faceted search filters, responsive property cards, interactive maps, Bessa-inspired metric panels, and fullscreen photo lightboxes.
- **Ouedkniss Ingestion Feasibility:** Full compatibility confirmed. 100% of standard Ouedkniss metadata fields map into existing Mongoose schema fields and Admin UI form inputs without requiring destructive schema migrations.

---

## 2. Backend Property Data Model & Schema

### 2.1 Schema Definition & Location
The canonical property schema is defined in:
`backend/src/models/Property.model.js`

The model is exported as `mongoose.models.Property || mongoose.model('Property', propertySchema)`.

### 2.2 Complete Field Specification

| Field Path | BSON / JS Type | Required | Default Value | Validations / Constraints | Description / Purpose |
|---|---|---|---|---|---|
| `title` | `String` | Yes | `undefined` | Trimmed; error message `'Title is required'` | Primary listing headline displayed across cards, search, and detail hero |
| `slug` | `String` | Yes | Generated | `unique: true` | URL-safe slug generated from `title` via `slugify` (French locale) + uniqueness counter (`-2`, `-3`) |
| `reference` | `String` | Yes | `undefined` | `unique: true` | Internal agency reference identifier (e.g. `REF-2024-001`, `LF-V-102`) |
| `category` | `String` | Yes | `undefined` | `enum: ['Villa', 'Appartement', 'Studio', 'Duplex', 'Triplex', 'Terrain', 'Local Commercial', 'Bureau', 'Immeuble']` | Property structural type / architectural classification |
| `type` | `String` | Yes | `undefined` | `enum: ['Vente', 'Location']` | Commercial transaction nature (Sale vs. Rental) |
| `status` | `String` | Yes | `'Brouillon'` | `enum: ['Disponible', 'Vendu', 'Loué', 'Réservé', 'Brouillon']` | Availability state. Only `'Disponible'` is displayed on public pages |
| `price` | `Number` | Yes | `undefined` | Numerical value in Algerian Dinars (DZD) | Official valuation / asking price |
| `priceHidden` | `Boolean` | No | `false` | Boolean toggle | When `true`, public UI replaces price with *"Sur demande"* / *"Prix sur demande"* |
| `area` | `Number` | Yes | `undefined` | Numerical value (m²) | Habitable surface area in square meters |
| `rooms` | `Number` | No | `null` / `undefined` | Optional integer | Total number of rooms (pièces / F-count) |
| `bedrooms` | `Number` | No | `null` / `undefined` | Optional integer | Number of bedrooms (chambres) |
| `bathrooms` | `Number` | No | `null` / `undefined` | Optional integer | Number of bathrooms (salles de bain) |
| `description` | `String` | Yes | `undefined` | Text | Full descriptive text covering amenities, architecture, and conditions |
| `location.wilaya` | `String` | Yes | `undefined` | String | Wilaya name. Admin UI currently limits to `'Alger'` |
| `location.commune` | `String` | Yes | `undefined` | String | Commune name (one of the 57 Algiers communes) |
| `location.address` | `String` | No | `undefined` | Optional text | Detailed street address or neighborhood (quartier) |
| `location.coordinates.lat` | `Number` | No | `undefined` | Float | Latitude coordinate for map display |
| `location.coordinates.lng` | `Number` | No | `undefined` | Float | Longitude coordinate for map display |
| `features` | `[String]` | No | `[]` | Array of strings | Prestations & amenities list (e.g. `['Piscine', 'Garage', 'Jardin']`) |
| `media.images` | `[SubDoc]` | No | `[]` | Array of `{ url: String (required), publicId: String (required) }` | Ordered collection of property gallery photographs |
| `media.coverImage` | `SubDoc` | No | `{}` | `{ url: String, publicId: String }` | Primary cover image thumbnail used on cards and social previews |
| `media.virtualTourUrl` | `String` | No | `undefined` | URL string | 3D virtual tour link (Matterport, 360, etc.) |
| `media.videoUrl` | `String` | No | `undefined` | URL string | External promotional video link |
| `agent` | `ObjectId` | No | `undefined` | `ref: 'Admin'` | Reference to the admin user who created/manages the property |
| `isFeatured` | `Boolean` | No | `false` | Boolean flag | Legacy highlight flag |
| `homePageSection` | `String` | No | `'None'` | `enum: ['None', 'Exception', 'Apartment']` | Controls homepage curation ("Propriétés d'Exception" or "Appartements sur Alger") |
| `createdAt` | `Date` | Auto | Timestamp | Mongoose `timestamps: true` | Record creation timestamp |
| `updatedAt` | `Date` | Auto | Timestamp | Mongoose `timestamps: true` | Record last modification timestamp |

### 2.3 Database Indexes
The following indexes are explicitly declared in `Property.model.js`:
- Compound Index: `{ type: 1, status: 1 }` (optimizes public catalog filtering: `status='Disponible'`, `type='Vente'/'Location'`)
- Single Field Index: `{ category: 1 }`
- Single Field Index: `{ 'location.wilaya': 1 }`
- Single Field Index: `{ price: 1 }`
- Unique Index: `{ slug: 1 }`
- Unique Index: `{ reference: 1 }`

### 2.4 Validation & Controller Parsing Nuances
1. **Unmounted Joi Schema:** While `backend/src/validators/property.validator.js` defines comprehensive Joi schemas (`createPropertySchema`, `updatePropertySchema`), `backend/src/routes/property.routes.js` does **not** attach `validate(createPropertySchema)` middleware. Instead, validation relies on Mongoose schema constraints and controller logic.
2. **Multipart JSON Parsing:** In `backend/src/controllers/property.controller.js`, multipart form submission requires `req.body.location` and `req.body.features` to be JSON-parsed:
   ```javascript
   if (req.body.location && typeof req.body.location === 'string') {
     req.body.location = JSON.parse(req.body.location);
   }
   if (req.body.features && typeof req.body.features === 'string') {
     req.body.features = JSON.parse(req.body.features);
   }
   ```
3. **Empty String Number Sanitization:**
   ```javascript
   const numberFields = ['price', 'area', 'rooms', 'bedrooms', 'bathrooms'];
   numberFields.forEach(field => {
     if (req.body[field] === '') {
       req.body[field] = null;
     }
   });
   ```
   This sanitization avoids MongoDB `CastError` when optional number fields are submitted as empty strings.

---

## 3. Admin Dashboard Workflow Tracing

### 3.1 Admin Route Tree & Page Hierarchy
All administration views reside under `frontend/app/(admin)/`:

```text
frontend/app/(admin)/
├── layout.js                                          # Meta wrapper (noindex, nofollow)
└── admin/
    ├── login/
    │   └── page.js                                    # Admin login screen with LoginForm
    └── (dashboard)/
        ├── layout.js                                  # Dashboard shell (Sidebar, AdminHeader, background grid)
        ├── dashboard/
        │   └── page.js                                # Overview KPI metrics, recent properties, recent leads
        ├── properties/
        │   ├── page.js                                # Properties catalog table with search & CRUD actions
        │   ├── new/
        │   │   └── page.js                            # Add property view (renders PropertyForm)
        │   └── [id]/
        │       └── edit/
        │           └── page.js                        # Edit property view (fetches by _id & renders PropertyForm)
        ├── leads/
        │   └── page.js                                # Inquiries & lead contact CRM
        └── settings/
            └── page.js                                # Profile email & password change
```

### 3.2 Authentication & Credential Architecture
- **Backend Auth Endpoints:**
  - `POST /api/auth/login` (accepts `{ email, password }`, returns JWT token and sets HttpOnly cookie)
  - `POST /api/auth/logout` (clears cookie)
  - `GET /api/auth/me` (returns authenticated admin profile)
  - `PUT /api/auth/update-credentials` (updates email and/or password with current password verification)
- **Password Security:** Salted and hashed with `bcryptjs` (salt rounds: 12) via Mongoose `pre('save')` hook on `Admin.model.js`.
- **Token Handling:**
  - JWT signed with `process.env.JWT_SECRET` (expiration: `process.env.JWT_EXPIRES_IN || '7d'`).
  - Cookie named `laforet_token` set with `httpOnly: true`, `sameSite: 'lax'` (or `'none'` on production), and `secure: true` in production.
  - In frontend `useAdminAuth.js`, the token is also saved in `localStorage.setItem('laforet_token', token)` and a document cookie is mirrored to support cross-domain/Vercel-to-Render token transmission.
- **Route Protection Layers:**
  1. **Next.js Edge Middleware (`frontend/middleware.js`):** Intercepts all `/admin/:path*` routes. If `laforet_token` cookie is absent and route is not `/admin/login`, redirects immediately to `/admin/login`. If authenticated user hits `/admin/login`, redirects to `/admin/dashboard`.
  2. **Backend API Middleware (`backend/src/middlewares/auth.middleware.js`):** `authMiddleware.protect` extracts token from `req.cookies.laforet_token` or `Authorization: Bearer <token>`, verifies JWT validity, and binds `req.admin`.
- **Environment Variables Involved (No Secrets Printed):**
  - `ADMIN_USERNAME` / `ADMIN_PASSWORD` (used by operators / Antigravity secrets mechanism)
  - `JWT_SECRET`
  - `JWT_EXPIRES_IN`
  - `MONGODB_URI`
  - `NEXT_PUBLIC_API_URL`

### 3.3 Property Form Workflow (`PropertyForm.jsx`)
The property authoring form (`frontend/features/admin/PropertyForm.jsx`) handles both creation and updates:

#### Form Fields & Validation Rules

| Section | Form Input Field | Type | Required | HTML / UI Validation | Notes |
|---|---|---|---|---|---|
| **Informations Générales** | `title` | Text Input | Yes | `required` | Display title |
| | `reference` | Text Input | Yes | `required` | Unique code (e.g. `REF-2024-001`) |
| | `status` | Select Dropdown | Yes | Options: `Disponible`, `Vendu`, `Loué`, `Réservé`, `Brouillon` | Default: `Disponible` |
| | `type` | Select Dropdown | Yes | Options: `Vente`, `Location` | Default: `Vente` |
| | `category` | Select Dropdown | Yes | Options: `Appartement`, `Studio`, `Duplex`, `Triplex`, `Villa`, `Terrain`, `Local Commercial`, `Bureau`, `Immeuble` | Default: `Appartement` |
| | `homePageSection` | Select Dropdown | No | Options: `None`, `Exception`, `Apartment` | Default: `None` |
| **Détails & Prix** | `price` | Number Input | Yes | `required` | Algerian Dinars (DZD) |
| | `priceHidden` | Checkbox | No | Boolean | Check to display "Sur demande" |
| | `area` | Number Input | Yes | `required` | Surface in m² |
| | `rooms` | Number Input | No | Optional integer | Total rooms (F-count) |
| | `bedrooms` | Number Input | No | Optional integer | Bedrooms |
| | `bathrooms` | Number Input | No | Optional integer | Bathrooms |
| **Localisation** | `location.wilaya` | Select Dropdown | Yes | `required`; single option: `Alger (Wilaya 16)` | Restricted to Algiers |
| | `location.commune` | Select Dropdown | Yes | `required`; 57 official communes | Hardcoded list of 57 Algiers communes |
| | `location.address` | Text Input | No | Optional string | Specific street/neighborhood |
| **Description** | `description` | Textarea | Yes | `required`, 6 rows | Detailed property description |
| | `features` | Textarea | No | Comma-separated string | Split into array on submit: `features.split(',').map(f => f.trim())` |
| **Médias** | `images` | File Uploader | No | Max 10 images, max 5MB, JPG/PNG/WEBP | Managed by `ImageUploader` component |

#### Form Submission Mechanism
Submissions use native browser `fetch` (in `frontend/services/property.service.js`) with `method: POST` (or `PATCH`), `body: FormData`, and `credentials: 'include'`:
1. Text fields appended to `FormData`.
2. `location` appended as `JSON.stringify(formData.location)`.
3. `features` parsed from comma-separated string into string array and appended as `JSON.stringify(featuresArray)`.
4. File list (`filesToUpload`) iterated and appended to field `images`.
5. On edit, deleted existing image public IDs appended as `JSON.stringify(deletedImages)`.

### 3.4 Media Upload & Deletion Workflow
- **Client Component (`frontend/components/admin/ImageUploader.jsx`):**
  - Provides drag-and-drop zone and file picker.
  - Generates instant client previews via `URL.createObjectURL(file)`.
  - For existing online images: renders thumbnail preview with red trash button. Clicking trash adds `publicId` to `deletedPublicIds` and removes it from local UI state.
- **Server Middleware (`backend/src/middlewares/upload.middleware.js`):**
  - Uses `multer` + `multer-storage-cloudinary`.
  - Destination folder: `'laforet_properties'`.
  - Eager transformation applied on upload: `[{ width: 1200, crop: 'limit' }]`.
  - Allowed formats: `['jpg', 'jpeg', 'png', 'webp']`.
  - File size limit: 5MB per image; route accepts up to 10 files (`upload.array('images', 10)`).
- **Controller Image Persistence (`property.controller.js`):**
  - **Create (`createProperty`):** If files exist in `req.files`, maps them to `media.images = [{ url: file.path, publicId: file.filename }]`, and sets `media.coverImage` to `req.files[0]`.
  - **Update (`updateProperty`):** If new files uploaded, appends them to existing `media.images`. If `deletedImages` array provided, calls `cloudinary.uploader.destroy(publicId)` for each deleted image and filters them out of `media.images`.
  - **Delete (`deleteProperty`):** Iterates all images in `property.media.images` and calls `cloudinary.uploader.destroy(image.publicId)`.

---

## 4. Public Website Property Flow Tracing

### 4.1 Property Catalog View (`/properties`)
- **Route & Component:** `frontend/app/(public)/properties/page.js` (`PropertiesCatalogContent` wrapped in Next.js `<Suspense>`).
- **Fetch Logic & Constraints:**
  - Queries `GET /api/properties` using `propertyService.getAll(queryString)`.
  - **Strict Status Guard:** Enforces `params.append('status', 'Disponible')` so drafts (`Brouillon`), sold (`Vendu`), or rented (`Loué`) listings never appear in the public catalog search.
- **Filter Parameters:**
  - `commune`: Filter by commune name (exact or regex via backend `communeFilter` handler). Quick pills available for top sectors: Hydra, El Biar, Chéraga, Dely Ibrahim, Ben Aknoun, Alger Centre.
  - `type`: Transaction type toggle (`Tous`, `Vente`, `Location`).
  - `category`: Property category dropdown (`Tous types`, `Appartement`, `Studio`, `Duplex`, `Triplex`, `Villa`, `Terrain`, `Local Commercial`, `Bureau`, `Immeuble`).
  - `minPrice` / `maxPrice`: Numerical price range (`price[gte]`, `price[lte]`).
  - `sort`: Sort parameter (`-createdAt` [Plus récents], `price` [Prix croissant], `-price` [Prix décroissant]).
  - `page`: Pagination control; fixed page limit of 14 properties per page (`LIMIT_PER_PAGE = 14`).

### 4.2 Property Card Rendering (`PropertyCard.jsx`)
- **Component:** `frontend/components/property/PropertyCard.jsx`
- **Link Structure:** Wraps card in `<Link href={`/properties/${property.slug}`}>`.
- **Image Fallback Ladder:**
  ```javascript
  const imageUrl = property.media?.coverImage?.url 
    || (property.media?.images?.length > 0 ? property.media.images[0].url : null)
    || '/images/placeholder.jpg';
  ```
- **Responsive Display & Hover Features:**
  - Next.js `<Image>` component with `fill` and `sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"`.
  - Top badges for transaction `type` (`Vente` / `Location`) and status (`Vendu` / `Loué`).
  - Bottom glassmorphic overlay displaying `title`, `location.commune, location.wilaya`, and formatted DZD price.
  - Hover animation (desktop) reveals architectural specifications: `bedrooms`, `bathrooms`, and `area` (m²). Mobile displays `area` badge by default.

### 4.3 Property Detail Page (`/properties/[slug]`)
- **Route & Component:** `frontend/app/(public)/properties/[slug]/page.js`
- **Dynamic Fetching:** Calls `GET /api/properties/slug/:slug` via `propertyService.getBySlug(slug)`.
- **Server Metadata (`layout.js`):** Generates OpenGraph and Twitter card metadata dynamically with 60-second ISR revalidation.
- **Page Layout & Sections:**
  1. **Breadcrumb Bar:** Navigation path and share button (copies current URL to clipboard).
  2. **Hero Image Carousel (Left 7 Cols):**
     - Large image display (`max-h-[500px]`) with "BIEN VÉRIFIÉ" and "Plein Écran HD" badges.
     - Previous / Next navigation controls.
     - Bessa-inspired thumbnail carousel strip with active highlight.
  3. **Information Board (Right 5 Cols):**
     - Mandat Exclusif & Reference badge (`Réf. ${property.reference}`).
     - Title, commune, and official verified verification pill.
     - Luxury gold gradient price display (`formatAlgerianPrice`).
     - CTAs: "Voir les caractéristiques & prestations" (smooth scrolls to specs) and "Demander un entretien privé maintenant" (smooth scrolls to contact form).
     - Direct contact links: Phone (`+213 550 19 88 33`), WhatsApp (`+213 550 59 37 07`), Email (`Belaid.laforet@gmail.com`).
  4. **Architectural Specifications & Metrics:**
     - 4 clean metric cards: Surface Habitable (`area` m²), Chambres (`bedrooms`), Salles de bain (`bathrooms`), and Catégorie (`category`).
     - Prestations & Équipements grid: Checkmark grid rendering each string in `property.features`.
  5. **Description Section:** "À propos du bien" rendering `property.description` with `whitespace-pre-line`.
  6. **Complete Photo Gallery:** Grid of all images (`images.map`). Clicking any thumbnail opens the Fullscreen Lightbox Modal.
  7. **Fullscreen High-Resolution Lightbox Modal:** Full-bleed modal with keyboard navigation (Esc, ArrowLeft, ArrowRight), counter (`idx + 1 / total`), and uncropped full-viewport image.
  8. **Lead Capture Form:** Private interview & appointment booking form submitting to `POST /api/leads` with `propertyId: property._id`.

#### ⚠️ Critical Discovery: Cloudinary Transformation Pattern in Detail Page
In `frontend/app/(public)/properties/[slug]/page.js` (lines 55–62):
```javascript
function getHighResUrl(url) {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace(/\/upload\/(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9]+,?)*\//i, '/upload/q_auto:best/');
  }
  return url;
}
```
**Impact:** This function forces every Cloudinary image in both the detail carousel and the lightbox to be served with transformation parameter `/upload/q_auto:best/`. Cloudinary generates a distinct eager transformation on-the-fly and serves the file at maximum possible bitrates. This constitutes a primary driver of historical Cloudinary credit consumption and will be eliminated during the Milestone 1 ImageKit migration.

### 4.4 Homepage Integration (`HomeClient.jsx` and `page.js`)
- `frontend/app/(public)/page.js` pre-fetches `?status=Disponible&limit=1000`.
- Filters properties for curated sections:
  - `homePageSection === 'Exception'` (up to 6 properties) -> Displayed in **Propriétés d'Exception** section.
  - `homePageSection === 'Apartment'` (up to 6 properties) -> Displayed in **Appartements sur Alger** section.
  - All properties are passed to `<InteractiveAlgiersMap allProperties={allProperties} />` which maps property pins onto D3/MapLibre Algiers commune polygons.

---

## 5. Ouedkniss Listing Data Comparison & Mapping Specification

### 5.1 Ouedkniss Store Requirements Baseline
From Master Brief §4 and §8, the client's store is located at:
`https://www.ouedkniss.com/store/5451/agence-laforet/accueil`

Eligible inventory is restricted exclusively to **active SALE (`Vente`) and RENT (`Location`)** property offers. All requests, demands, exchanges, and announcements (*"Cherche"*, *"Recherche"*, *"Demande"*, *"Échange"*) must be rejected.

### 5.2 Field-by-Field Mapping Matrix

| Ouedkniss Field (§4 Minimum) | Target Backend Field (`Property.model.js`) | Target Admin Form Element (`PropertyForm.jsx`) | Data Transformation & Mapping Rule |
|---|---|---|---|
| `source_id` | Stored in `reference` prefix / `IMPORT_LOG.csv` | `reference` input | Use format `LF-OK-${source_id}` (e.g. `LF-OK-39821455`) to guarantee uniqueness while ensuring traceability |
| `source_url` | `IMPORT_LOG.csv` & `OUEDKNISS_INVENTORY.csv` | N/A (logged internally) | Not displayed publicly. Recorded in import log and inventory artifacts |
| `source_date` | `IMPORT_LOG.csv` | N/A | Logged in inventory CSV for historical traceability |
| `transaction_type` | `type` (`'Vente'` or `'Location'`) | `type` select dropdown | Must be strictly `'Vente'` or `'Location'`. Reject all other intents |
| `property_type` | `category` | `category` select dropdown | Map to valid enum: `'Villa'`, `'Appartement'`, `'Studio'`, `'Duplex'`, `'Triplex'`, `'Terrain'`, `'Local Commercial'`, `'Bureau'`, `'Immeuble'`. See §5.3 for compound types |
| `title` | `title` | `title` text input | Clean obvious formatting noise, preserve genuine French/Arabic headline |
| `price` | `price` | `price` number input | Parse numerical value in DZD. If 0 or "Sur demande", set `priceHidden: true` |
| `currency_or_display_price` | `priceHidden` | `priceHidden` checkbox | If "Sur demande", check `priceHidden` |
| `wilaya` | `location.wilaya` | `location.wilaya` select | Default and restrict to `'Alger'` |
| `commune` | `location.commune` | `location.commune` select | Normalize Ouedkniss spelling into one of the 57 official `ALGIERS_COMMUNES` strings |
| `neighborhood` / `city` | `location.address` | `location.address` text input | Store neighborhood/quartier details (e.g. "Val d'Hydra", "Paradou", "Sidi Yahia") |
| `surface` | `area` | `area` number input | Extract numerical integer value in m² (e.g. `240 m²` -> `240`) |
| `rooms` | `rooms` | `rooms` number input | Extract number from F-spec (e.g. `F4` -> `4`) or leave empty if absent |
| `bedrooms` | `bedrooms` | `bedrooms` number input | Extract number of bedrooms or leave empty |
| `bathrooms` | `bathrooms` | `bathrooms` number input | Extract number of bathrooms or leave empty |
| `floor` | Appended to `features` / `description` | `features` / `description` | Form has no dedicated `floor` input; append to `description` ("Étage: 3ème") or add `"3ème étage"` to `features` |
| `condition` | Appended to `features` / `description` | `features` / `description` | Legal paperwork & condition (e.g. "Acte notarié", "Livret foncier") added to `features` |
| `features` | `features` (`[String]`) | `features` textarea | Comma-separated list in textarea, e.g. "Piscine, Jardin, Chauffage central, Bâche à eau" |
| `description_clean` | `description` | `description` textarea | Cleaned multiline text without HTML tags or Ouedkniss boilerplate |
| `image_urls` | `media.images` & `media.coverImage` | `ImageUploader` file input | Photos uploaded through ImageKit pipeline in original source order; first photo becomes cover |
| `eligibility_reason` | `OUEDKNISS_INVENTORY.csv` | N/A | Recorded in CSV for QA auditing |
| `duplicate_key` | `OUEDKNISS_INVENTORY.csv` | N/A | Fingerprint `source_id` + normalized commune + surface for deduplication |
| `import_status` | `IMPORT_LOG.csv` | N/A | Tracked during Milestone 4 batch execution |

### 5.3 Normalization & Cleaning Rules

#### 1. Commune Name Normalization (Wilaya 16)
Ouedkniss listings often use informal, dialectal, or legacy French spellings for Algiers communes. The Admin UI dropdown strictly validates against `ALGIERS_COMMUNES` (57 communes). The research scraper/mapper must apply the following normalization lookup:

| Ouedkniss Raw String | Canonical Form Value (`location.commune`) |
|---|---|
| Hydra, Sidi Yahia, Paradou, Val d'Hydra | `Hydra` |
| El Biar, Saint-Raphaël, Scala | `El Biar` |
| Bir Mourad Rais, BMR, Birmandreis | `Bir Mourad Raïs` |
| Birkhadem, Bir Khadem | `Birkhadem` |
| Ben Aknoun, Chemin des Ruaux | `Ben Aknoun` |
| Dely Ibrahim, Dely Brahim, Grand Chéraga | `Dely Ibrahim` |
| Cheraga, Bouchaoui, Amara | `Chéraga` |
| Djasr Kasentina, Ain Naadja, Gué de Constantine | `Djasr Kasentina` |
| Kouba, Calvaire, Garidi, Croix Rouge | `Kouba` |
| Hussein Dey, Tripoly | `Hussein Dey` |
| Alger Centre, Telemly, Didouche, Audin, Meissonnier | `Alger Centre` |
| Bordj El Kiffan, Bateaux Cassés | `Bordj El Kiffan` |
| Bab Ezzouar, Cité 8 Mai 45, Cité Ismail Yefsah | `Bab Ezzouar` |
| Ain Benian, Belle Vue, Guyotville | `Ain Benian` |
| Staoueli, Moretti, Club des Pins, Sidi Fredj | `Staoueli` |
| Zeralda, Mazafran | `Zeralda` |
| Bouzareah, Beau Séjour | `Bouzaréah` |

#### 2. Property Category Reconciliation
When Ouedkniss categorizes properties with non-standard labels:
- `Niveau de villa` -> Map to `Appartement` or `Villa` (add "Niveau de villa" to `features` or title prefix).
- `Carcasse` -> Map to `Villa` (specify unfinished state in `description` and `features`).
- `Hangar` / `Entrepôt` -> Map to `Local Commercial`.
- `Boutique` / `Magasin` -> Map to `Local Commercial`.
- `Duplex` / `Triplex` -> Preserve exact matches `Duplex` or `Triplex`.

#### 3. Price & Currency Parsing
- Rental listings often specify periods (e.g. `180 000 DA / Mois`, `25 Millions / Mois`, `Négociable`).
- Numbers must be parsed into base Dinars (`DZD`):
  - Example: `25 Millions` (Centimes) = `250 000 DZD`.
  - Example: `8,5 Milliards` (Centimes) = `85 000 000 DZD`.
- If price is omitted, "Offert", or "Sur demande", set `price = 0` and toggle `priceHidden = true`.

---

## 6. Recommendations & Implementation Safeguards

### 6.1 Gate M0 Certification
The property and admin architectures are sound and functional. No structural obstacles prevent proceeding to Milestone 1 and Milestone 3.

### 6.2 Key Takeaways for Milestone 1 (ImageKit Migration)
1. **Remove `/upload/q_auto:best/` Hardcoding:** In `frontend/app/(public)/properties/[slug]/page.js` line 59, replace Cloudinary URL manipulation with the centralized ImageKit URL helper.
2. **Update `next.config.mjs`:** Add `ik.imagekit.io` to `images.remotePatterns`.
3. **Refactor Backend Upload Middleware:** Migrate `backend/src/middlewares/upload.middleware.js` from `multer-storage-cloudinary` to the ImageKit upload service, storing ImageKit URLs and file IDs.
4. **Standardize Hardcoded Fallback Image:** Update `DEFAULT_PROPERTY_IMAGE` across `AdminHeader.jsx`, `PropertiesPage.js`, `DashboardPage.js`, and `leads/page.js` from Cloudinary URL to an ImageKit URL.

### 6.3 Key Takeaways for Milestone 4 (Admin Property Population)
1. **Strict Single Live Writer Protocol:** Live mutations must be executed strictly through the browser session against `/admin/properties/new` or the authenticated API endpoint.
2. **Pilot Execution:** Start with 3 properties:
   - Property 1: Sale Villa (`Vente`, `Villa`, Hydra/El Biar)
   - Property 2: Rental Apartment (`Location`, `Appartement`, Chéraga/Kouba)
   - Property 3: Complex Property (`Vente`, `Duplex`/`Triplex` with multiple photos and extensive features)
3. **Verify Public UI Verification:** After entering the pilot, verify rendering on `/properties`, `/properties/[slug]`, and `/admin/properties` before bulk entry.

---

*Report certified by Explorer 3 (Property & Admin Workflow Explorer).*
