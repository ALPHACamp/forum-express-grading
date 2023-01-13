const express = require('express');
const router = express.Router();
const restController = require('../controllers/restaurant-controller');
const userController = require('../controllers/user-controller');
const { generalErrorHandler } = require('../middleware/error-handle');
const admin = require('./modules/admin');

// Section all routes
// note 條件多的要擺最前面，不然一匹配到就會直接進入該指定的位置
router.use('/admin', admin);

router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);

router.get('/restaurants', restController.getRestaurants);

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.use('/', generalErrorHandler);

module.exports = router;
