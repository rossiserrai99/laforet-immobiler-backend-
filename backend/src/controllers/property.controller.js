const Property = require('../models/Property.model');
const APIFeatures = require('../utils/apiFeatures');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const cloudinary = require('../config/cloudinary');
const generateSlug = require('../utils/generateSlug');

exports.getAllProperties = asyncHandler(async (req, res, next) => {
  const queryObj = { ...req.query };
  const communeFilter = queryObj.commune || queryObj.location || queryObj['location.commune'];

  const baseFilter = {};

  if (communeFilter) {
    delete queryObj.commune;
    delete queryObj.location;
    delete queryObj['location.commune'];

    const normalized = communeFilter.trim().replace(/[\s-]+/g, '.*');
    let regPattern = normalized;

    if (/^hydra$/i.test(communeFilter)) {
      regPattern = '^(hydra|sidi.*yahya|sidi.*yahia)$';
    } else if (/^djasr.*kasentina$/i.test(communeFilter) || /^ain.*naaja$/i.test(communeFilter)) {
      regPattern = '^(djasr.*kasentina|ain.*naaja|aïn.*naadja)$';
    } else if (/^alger.*centre$/i.test(communeFilter) || /^alger$/i.test(communeFilter)) {
      regPattern = '^(alger.*centre|alger)$';
    } else if (/^dely.*ibrahim$/i.test(communeFilter)) {
      regPattern = '^(dely.*ibrahim|delybrahim|dely.*brahim)$';
    } else if (/^ben.*aknoun$/i.test(communeFilter)) {
      regPattern = '^(ben.*aknoun|benaknoun)$';
    } else if (/^bir.*mourad.*rais$/i.test(communeFilter)) {
      regPattern = '^(bir.*mourad.*rais|birmouradrais)$';
    } else if (/^el.*biar$/i.test(communeFilter)) {
      regPattern = '^(el.*biar|elbiar)$';
    } else if (/^bir.*khadem$/i.test(communeFilter)) {
      regPattern = '^(bir.*khadem|birkhadem)$';
    }

    baseFilter['location.commune'] = { $regex: new RegExp(regPattern, 'i') };
  }

  const features = new APIFeatures(Property.find(baseFilter), queryObj)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const properties = await features.query;
  const total = await Property.countDocuments(features.query.getFilter());

  sendSuccess(res, 200, {
    total,
    results: properties.length,
    properties
  });
});

exports.getProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findOne({ slug: req.params.slug });

  if (!property) {
    return next(new AppError('Aucun bien trouvé avec ce slug.', 404));
  }

  sendSuccess(res, 200, { property });
});

exports.createProperty = asyncHandler(async (req, res, next) => {
  console.log('--- CREATE PROPERTY REQUEST ---');
  console.log('req.body:', req.body);
  console.log('req.files:', req.files);
  
  req.body.agent = req.admin.id;
  
  if (req.body.title) {
    req.body.slug = await generateSlug(Property, req.body.title);
  }

  // Handle uploaded images
  if (req.files && req.files.length > 0) {
    req.body.media = {
      images: req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }))
    };
    
    // Set first image as cover by default
    req.body.media.coverImage = {
      url: req.files[0].path,
      publicId: req.files[0].filename
    };
  }

  try {
    if (req.body.location && typeof req.body.location === 'string') {
      req.body.location = JSON.parse(req.body.location);
    }
    if (req.body.features && typeof req.body.features === 'string') {
      req.body.features = JSON.parse(req.body.features);
    }

    // Convert empty strings to null for number fields to prevent CastError
    const numberFields = ['price', 'area', 'rooms', 'bedrooms', 'bathrooms'];
    numberFields.forEach(field => {
      if (req.body[field] === '') {
        req.body[field] = null;
      }
    });
  } catch (error) {
    return next(new AppError('Données JSON invalides (location ou features).', 400));
  }

  const newProperty = await Property.create(req.body);

  sendSuccess(res, 201, { property: newProperty }, 'Bien créé avec succès.');
});

exports.updateProperty = asyncHandler(async (req, res, next) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError('Aucun bien trouvé avec cet ID.', 404));
  }

  // If new images are uploaded, append them
  if (req.files && req.files.length > 0) {
    const newImages = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));

    if (!req.body.media) req.body.media = {};
    req.body.media.images = [...(property.media?.images || []), ...newImages];
    
    // Set coverImage if none exists
    if (!property.media?.coverImage?.url) {
      req.body.media.coverImage = newImages[0];
    }
  }

  // Handle deleted images
  if (req.body.deletedImages) {
    try {
      const deletedPublicIds = typeof req.body.deletedImages === 'string' 
        ? JSON.parse(req.body.deletedImages) 
        : req.body.deletedImages;
      
      for (const publicId of deletedPublicIds) {
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
      
      if (!req.body.media) req.body.media = property.media || {};
      
      // Filter out deleted images
      const currentImages = req.body.media.images || property.media?.images || [];
      req.body.media.images = currentImages.filter(img => !deletedPublicIds.includes(img.publicId));
      
      // If the cover image was deleted, clear it so it can be reassigned or left empty
      if (property.media?.coverImage && deletedPublicIds.includes(property.media.coverImage.publicId)) {
        req.body.media.coverImage = req.body.media.images.length > 0 ? req.body.media.images[0] : null;
      }
    } catch (err) {
      console.error('Error parsing or deleting images:', err);
    }
  }

  try {
    if (req.body.location && typeof req.body.location === 'string') {
      req.body.location = JSON.parse(req.body.location);
    }
    if (req.body.features && typeof req.body.features === 'string') {
      req.body.features = JSON.parse(req.body.features);
    }

    // Convert empty strings to null for number fields to prevent CastError
    const numberFields = ['price', 'area', 'rooms', 'bedrooms', 'bathrooms'];
    numberFields.forEach(field => {
      if (req.body[field] === '') {
        req.body[field] = null;
      }
    });
  } catch (error) {
    return next(new AppError('Données JSON invalides (location ou features).', 400));
  }

  if (req.body.title && req.body.title !== property.title) {
    req.body.slug = await generateSlug(Property, req.body.title);
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  sendSuccess(res, 200, { property }, 'Bien mis à jour avec succès.');
});

exports.deleteProperty = asyncHandler(async (req, res, next) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return next(new AppError('Aucun bien trouvé avec cet ID.', 404));
  }

  // Delete images from Cloudinary
  if (property.media && property.media.images) {
    for (const image of property.media.images) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId);
      }
    }
  }

  await Property.findByIdAndDelete(req.params.id);

  sendSuccess(res, 200, null, 'Bien supprimé avec succès.');
});
