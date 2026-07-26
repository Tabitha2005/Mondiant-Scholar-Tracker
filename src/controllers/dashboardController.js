const ScanEvent = require('../models/ScanEvent');
const Applicant = require('../models/Applicant');

async function getSummary(req, res, next) {
  try {
    const totalScans = await ScanEvent.countDocuments();
    const totalApplicants = await Applicant.countDocuments();
    const completionRate = totalScans > 0
      ? Number(((totalApplicants / totalScans) * 100).toFixed(1))
      : 0;

    // scans grouped by day, for a simple time-series chart
    const scansByDay = await ScanEvent.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // applicants grouped by region, for a breakdown chart
    const applicantsByRegion = await Applicant.aggregate([
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      totalScans,
      totalApplicants,
      completionRate,
      scansByDay,
      applicantsByRegion,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
