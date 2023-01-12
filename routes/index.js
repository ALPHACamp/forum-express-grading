const express = require('express');
const router = express.Router();
const restController = require('../controllers/restaurant-controller');

// Section all routes
// note 條件多的要擺最前面，不然一匹配到就會直接進入該指定的位置
router.get('/restaurants', restController.getRestaurants);

router.use('/', (req, res) => {
  res.redirect('/restaurants');
});

module.exports = router;
