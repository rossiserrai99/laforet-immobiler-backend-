const multer = require('multer');
const AppError = require('../utils/appError');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Format de fichier non supporté. Formats acceptés : JPG, JPEG, PNG, WEBP.', 400), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per image
  },
  fileFilter: fileFilter
});

module.exports = upload;
