const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
  console.error('DEV ERROR:', err);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle JWT errors universally (both dev and prod)
  if (err.name === 'JsonWebTokenError') {
    err = new AppError('Session invalide. Veuillez vous reconnecter.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    err = new AppError('Votre session a expiré. Veuillez vous reconnecter.', 401);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, name: err.name, code: err.code, keyValue: err.keyValue };

    if (error.name === 'CastError') error = new AppError(`Format invalide pour le champ ${error.path}: ${error.value}.`, 400);
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      error = new AppError(`La valeur '${value}' pour le champ '${field}' existe déjà. Veuillez en choisir une autre (ex: Référence unique).`, 400);
    }
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      error = new AppError(`Données invalides : ${errors.join(' ')}`, 400);
    }

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
