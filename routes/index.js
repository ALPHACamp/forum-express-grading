const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const restController = require('../controllers/restaurant-controller');
const userController = require('../controllers/user-controller');
const { authenticated, authenticatedAdmin } = require('../middleware/auth');
const { generalErrorHandler } = require('../middleware/error-handle');
const admin = require('./modules/admin');

// Section all routes
// note 條件多或最嚴格的要擺最前面，不然一匹配到就會直接進入該指定的位置
router.use('/admin', authenticatedAdmin, admin);

router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);

router.get('/signin', userController.signInPage);
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: 'signin',
    failureFlash: true
  }),
  userController.signIn
);

router.get('/logout', userController.logout);

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)

// note 原先驗證一般使用者，之後多authenticated來驗證admin user
router.get('/restaurants', authenticated, restController.getRestaurants);

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.use('/', generalErrorHandler);

module.exports = router;
