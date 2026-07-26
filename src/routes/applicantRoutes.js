const express = require('express');
const router = express.Router();
const { submitApplicant, listApplicants } = require('../controllers/applicantController');

router.post('/', submitApplicant);
router.get('/', listApplicants);

module.exports = router;
