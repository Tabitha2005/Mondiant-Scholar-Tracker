const Applicant = require('../models/Applicant');

async function submitApplicant(req, res, next) {
  try {
    const { fullName, email, phone, region, interest } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: true, message: 'Full name and email are required.' });
    }

    const applicant = await Applicant.create({ fullName, email, phone, region, interest });
    res.status(201).json(applicant);
  } catch (err) {
    next(err);
  }
}

async function listApplicants(req, res, next) {
  try {
    const applicants = await Applicant.find().sort({ createdAt: -1 });
    res.json(applicants);
  } catch (err) {
    next(err);
  }
}

module.exports = { submitApplicant, listApplicants };
