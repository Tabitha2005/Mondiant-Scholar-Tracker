const flowcodeService = require('../services/flowcodeService');
const ScanEvent = require('../models/ScanEvent');

// Called once (manually, via a small script or Postman) to generate
// the actual Flowcode you print/display for Sunday's presentation.
async function createFlowcode(req, res, next) {
  try {
    const destinationUrl = process.env.FLOWCODE_DESTINATION_URL;
    const data = await flowcodeService.createFlowcode({
      name: 'Mondiant Scholarship Applicant Onboarding',
      destinationUrl,
    });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

async function getAnalytics(req, res, next) {
  try {
    const { flowcodeId } = req.params;
    const data = await flowcodeService.getFlowcodeAnalytics(flowcodeId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Logged by our own landing page on load — independent of Flowcode's
// own analytics, so the live dashboard never waits on a third-party call.
async function logScan(req, res, next) {
  try {
    const { referrer } = req.body;
    const scan = await ScanEvent.create({
      referrer: referrer || '',
      userAgent: req.headers['user-agent'] || '',
    });
    res.status(201).json(scan);
  } catch (err) {
    next(err);
  }
}

module.exports = { createFlowcode, getAnalytics, logScan };
