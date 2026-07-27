const Lead = require('../models/Lead.model');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

exports.createLead = asyncHandler(async (req, res, next) => {
  const newLead = await Lead.create(req.body);
  sendSuccess(res, 201, { lead: newLead }, 'Votre demande a bien été envoyée.');
});

exports.getAllLeads = asyncHandler(async (req, res, next) => {
  const leads = await Lead.find().sort('-createdAt').populate('propertyId');
  sendSuccess(res, 200, {
    results: leads.length,
    leads
  });
});

exports.updateLeadStatus = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status },
    { new: true, runValidators: true }
  );

  if (!lead) {
    return next(new AppError('Aucun lead trouvé avec cet ID.', 404));
  }

  sendSuccess(res, 200, { lead }, 'Statut mis à jour avec succès.');
});

exports.deleteLead = asyncHandler(async (req, res, next) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);

  if (!lead) {
    return next(new AppError('Aucun lead trouvé avec cet ID.', 404));
  }

  sendSuccess(res, 200, null, 'Lead supprimé avec succès.');
});
