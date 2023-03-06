/* For front-end system */
const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const restController = require('../controllers/restaurant-controller');
const userController = require('../controllers/user-controller');
const commentController = require('../controllers/comment-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth');
const { generalErrorHandler } = require('../middleware/error-handle');
const admin = require('./modules/admin');

const upload = require('../middleware/multer');

// Section all routes
// note 條件多或最嚴格的要擺最前面，不然一匹配到就會直接進入該指定的位置
// note 先驗證是否為amin
// admin, login, logout
router.use('/admin', authenticatedAdmin, admin);

// not-admin
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInPage);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn);
router.get('/logout', userController.logout);

router.get('/users/top', authenticated, userController.getTopUsers)

// edit user's profile section
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser);

// note feeds為動態路由，若feeds擺在:id後面，根據express走法，會先抓到id後，判定feed = id而導致錯誤
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// note 原先驗證一般使用者，之後多authenticated來驗證admin user
router.get('/restaurants', authenticated, restController.getRestaurants);

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// favorite section
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// like section
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// follower section
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.use('/', generalErrorHandler);

module.exports = router;
