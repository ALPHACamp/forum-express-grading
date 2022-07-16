const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const categories = require('./modules/categories')
const users = require('./modules/users')
const upload = require('../middleware/multer')

router.use('/admin/categories', authenticatedAdmin, categories)
router.use('/admin', authenticatedAdmin, admin)
router.use('/users', authenticated, users)
router.get('/signup', userController.signUpPage)
router.post('/signup', upload.single('image'), userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
)
router.post('/comments', authenticated, commentController.postComment)
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
