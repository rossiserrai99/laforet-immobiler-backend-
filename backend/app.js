const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const routes = require('./src/routes');

const { generalLimiter } = require('./src/middlewares/rateLimiter.middleware');
const requestLogger = require('./src/middlewares/logger.middleware');
const errorHandler = require('./src/middlewares/error.middleware');
const AppError = require('./src/utils/AppError');

const app = express();

// Trust proxy for secure cookies behind reverse proxies (Vercel/Render/Cloudflare)
app.set('trust proxy', 1);

// Security HTTP headers
// Custom CSP allowing Cloudinary and Google Fonts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000'],
    },
  },
}));

// CORS - Support localhost, 127.0.0.1, FRONTEND_URL, and deployment domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'https://laforet-immobiler.onrender.com',
  'https://laforet-immobilier.onrender.com',
  'https://laforet-immobiler-backend.vercel.app',
  'https://agenceimmobiliere-laforet.online',
  'https://www.agenceimmobiliere-laforet.online',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: (origin, callback) => {
    // Allow requests with no origin or matching allowedOrigins or Render / Vercel deployment URLs
    const isAllowed = !origin || 
      allowedOrigins.some(o => origin === o || origin === o.replace(/\/$/, '')) ||
      origin.includes('agenceimmobiliere-laforet') ||
      origin.includes('laforet-immobiler') ||
      origin.includes('laforet-immobilier') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

// Rate limiting
app.use('/api', generalLimiter);

// Development logging
if (process.env.NODE_ENV !== 'production') {
  app.use(requestLogger);
}

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

app.use(cookieParser());

// Routes
app.use('/api', routes);

// 404 Handler for unhandled routes
app.use((req, res, next) => {
  next(new AppError(`Impossible de trouver ${req.originalUrl} sur ce serveur!`, 404));
});

// Global Error Handling Middleware
app.use(errorHandler);

module.exports = app;
