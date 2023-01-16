/* For back-end system */

const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin-controller');

// Section all routes
// note 條件多或最嚴格的的要擺最前面，不然一匹配到就會直接進入該指定的位置
// notice authenticatedAdmin使用太多，抽離到index去見證
router.get('/restaurants/create', adminController.createRestaurant);

router.get('/restaurants/:res_id', adminController.getRestaurant);

router.get('/restaurants', adminController.getRestaurants);

router.post('/restaurants', adminController.postRestaurant);

router.get('/', (req, res) => {
  res.redirect('/admin/restaurants');
});

module.exports = router;
