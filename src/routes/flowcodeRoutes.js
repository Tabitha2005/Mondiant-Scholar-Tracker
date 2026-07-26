const express = require('express');
const router = express.Router();
const { createFlowcode, getAnalytics, logScan } = require('../controllers/flowcodeController');

router.post('/create', createFlowcode);
router.get('/:flowcodeId/analytics', getAnalytics);
router.post('/scan', logScan);

module.exports = router;
