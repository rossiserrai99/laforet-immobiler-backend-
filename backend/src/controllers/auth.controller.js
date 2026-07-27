const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.model');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super-secret-fallback-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const createSendToken = (admin, statusCode, res) => {
  const token = signToken(admin._id);

  const isSecure = process.env.NODE_ENV === 'production' || res.req?.secure || res.req?.headers['x-forwarded-proto'] === 'https';
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax'
  };

  res.cookie('laforet_token', token, cookieOptions);

  admin.password = undefined; // Remove password from output

  sendSuccess(res, statusCode, { admin, token });
};

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Veuillez fournir un email et un mot de passe.', 400));
  }

  const admin = await Admin.findOne({ email }).select('+password');

  if (!admin || !(await admin.comparePassword(password))) {
    return next(new AppError('Email ou mot de passe incorrect.', 401));
  }

  createSendToken(admin, 200, res);
});

exports.logout = (req, res) => {
  const isSecure = process.env.NODE_ENV === 'production' || req.secure || req.headers['x-forwarded-proto'] === 'https';
  res.cookie('laforet_token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isSecure,
    sameSite: isSecure ? 'none' : 'lax'
  });
  sendSuccess(res, 200, null, 'Déconnexion réussie.');
};

exports.getMe = asyncHandler(async (req, res, next) => {
  // req.admin is set by auth middleware
  const admin = await Admin.findById(req.admin.id);
  sendSuccess(res, 200, { admin });
});

exports.updateCredentials = asyncHandler(async (req, res, next) => {
  const { currentPassword, newEmail, newPassword } = req.body;

  if (!currentPassword) {
    return next(new AppError('Veuillez fournir votre mot de passe actuel.', 400));
  }

  // Get admin with password
  const admin = await Admin.findById(req.admin.id).select('+password');

  // Check current password
  if (!(await admin.comparePassword(currentPassword))) {
    return next(new AppError('Le mot de passe actuel est incorrect.', 401));
  }

  // Update email if provided
  if (newEmail) {
    admin.email = newEmail;
  }

  // Update password if provided
  if (newPassword) {
    if (newPassword.length < 8) {
      return next(new AppError('Le nouveau mot de passe doit contenir au moins 8 caractères.', 400));
    }
    admin.password = newPassword;
  }

  await admin.save();

  // Send new token so user remains logged in
  createSendToken(admin, 200, res);
});
