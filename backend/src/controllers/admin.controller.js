const Property = require('../models/Property.model');
const Lead = require('../models/Lead.model');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  // Run queries in parallel for performance
  const [
    totalProperties,
    activeProperties,
    totalLeads,
    newLeads
  ] = await Promise.all([
    Property.countDocuments(),
    Property.countDocuments({ status: 'Disponible' }),
    Lead.countDocuments(),
    Lead.countDocuments({ status: { $in: ['New', 'Nouveau'] } })
  ]);

  sendSuccess(res, 200, {
    stats: {
      totalProperties,
      activeProperties,
      totalLeads,
      newLeads
    }
  });
});
