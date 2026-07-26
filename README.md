# LA FORÊT — Agence Immobilière de Luxe

Premium luxury real estate platform for Algiers, Algeria. Built with Next.js 16, Express.js 5, MongoDB, and Cloudinary.

---

## 🏗️ Architecture

| Component | Technology | Hosting |
|-----------|-----------|---------|
| Frontend | Next.js 16 (React 19, Tailwind v4) | [Vercel](https://vercel.com) |
| Backend API | Express.js 5 (Node.js) | [Render](https://render.com) |
| Database | MongoDB Atlas | [MongoDB](https://cloud.mongodb.com) |
| Media Storage | Cloudinary | [Cloudinary](https://cloudinary.com) |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone & Install
```bash
git clone https://github.com/rossiserraiprime-spec/laforet-test.git
cd laforet-test

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/laforet?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_min_64_chars
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 3. Seed Admin User
```bash
cd backend
npm run seed:admin
```

### 4. Run Development Servers
```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the website.
Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin dashboard.

---

## 🌐 Production Deployment

### Step 1: Deploy Backend on Render
1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect the GitHub repo
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `node server.js`
6. Add environment variables (see `.env.example`)
7. Set `NODE_ENV` to `production`
8. Copy the resulting URL (e.g. `https://laforet-backend.onrender.com`)

### Step 2: Deploy Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → **Import Project**
2. Connect the GitHub repo
3. Set **Root Directory** to `frontend`
4. Set **Framework Preset** to `Next.js`
5. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = `https://laforet-backend.onrender.com/api`
6. Deploy!

### Step 3: Update Backend CORS
1. Go back to Render dashboard
2. Set `FRONTEND_URL` to your Vercel URL (e.g. `https://laforet.vercel.app`)
3. Redeploy the backend

---

## 📁 Project Structure

```
laforet-test/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── config/       # Database & Cloudinary config
│   │   ├── controllers/  # Route handlers
│   │   ├── middlewares/   # Auth, error handling, uploads
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # API route definitions
│   │   ├── scripts/      # Admin seeding script
│   │   ├── utils/        # Helpers & error classes
│   │   └── validators/   # Joi validation schemas
│   ├── app.js            # Express app configuration
│   └── server.js         # Server entry point
├── frontend/             # Next.js 16 application
│   ├── app/              # App Router pages & layouts
│   ├── components/       # Reusable UI components
│   ├── features/         # Feature-specific components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # API client & constants
│   ├── services/         # API service layer
│   └── store/            # Zustand state management
├── vercel.json           # Vercel deployment config
├── render.yaml           # Render deployment config
└── .env.example          # Environment variable template
```

---

## 📜 License

Private. All rights reserved.
