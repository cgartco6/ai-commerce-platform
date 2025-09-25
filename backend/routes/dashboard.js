const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get dashboard metrics
router.get('/metrics', auth, async (req, res) => {
  try {
    // In a real app, this would fetch from database
    const metrics = {
      revenue: 12458,
      visitors: 3842,
      conversionRate: 6.2,
      activeCampaigns: 8
    };

    const recommendations = [
      {
        type: 'success',
        message: 'Increase budget for "Summer Collection" campaign - ROI is 320%'
      },
      {
        type: 'info',
        message: 'Generate new product descriptions for 12 items with low conversion'
      },
      {
        type: 'warning',
        message: 'Retrain recommendation model with latest customer data'
      }
    ];

    res.json({
      success: true,
      metrics,
      recommendations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

module.exports = router;
