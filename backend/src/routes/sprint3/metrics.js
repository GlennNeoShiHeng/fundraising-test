// Sprint 3 - Story #19 (FR-02) - View FRA Performance Metrics (Fund Raiser)
const express = require('express')
const router = express.Router()
const { authenticate, requireRole } = require('../../middleware/auth')
const { getAllPerformanceData, getPerformanceData } = require('../../controllers/sprint3/metricsController')

// GET /api/metrics - all activities with metrics for the logged-in fund raiser
router.get('/', authenticate, requireRole('fund_raiser'), getAllPerformanceData)

// GET /api/metrics/:fraID - single activity metrics
router.get('/:fraID', authenticate, requireRole('fund_raiser'), getPerformanceData)

module.exports = router
