/* For back-end system */

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin-controller');

// Section all routes
// note 條件多的要擺最前面，不然一匹配到就會直接進入該指定的位置
router.get('/restaurants', adminController.getRestaurants);

router.use('/', (req, res) => {
  res.redirect('/admin/restaurants');
});

module.exports = router;
