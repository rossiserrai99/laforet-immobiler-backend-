const rateLimit = require('express-rate-limit');

// General rate limiter: 5000 requests per 15 minutes (accommodates Next.js SSR and client navigation)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5000, 
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Strict rate limiter for auth routes: 50 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50, 
  message: 'Too many login attempts from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  authLimiter
};
