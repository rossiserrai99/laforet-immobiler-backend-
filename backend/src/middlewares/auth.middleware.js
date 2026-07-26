const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const Admin = require('../models/Admin.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.cookies.laforet_token) {
    token = req.cookies.laforet_token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Vous n\'êtes pas connecté. Veuillez vous connecter pour accéder.', 401));
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET || 'super-secret-fallback-key');

  // Check if admin still exists
  const currentAdmin = await Admin.findById(decoded.id);
  if (!currentAdmin) {
    return next(new AppError('L\'utilisateur appartenant à ce jeton n\'existe plus.', 401));
  }

  // Grant access to protected route
  req.admin = currentAdmin;
  next();
});
