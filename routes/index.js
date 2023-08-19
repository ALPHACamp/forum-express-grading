const express = require('express')
const router = express.Router()

// Import controllers
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

// Import middleware
const {
  authenticated,
  authenticatedAdmin,
  checkUserOwnership
} = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

// Import admin module
const admin = require('./modules/admin')
router.use('/admin', authenticatedAdmin, admin)

// Set signup page
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Set signin page
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

// Set user related page
router.get('/users/top', authenticated, userController.getTopUsers)
router.get(
  '/users/:id/edit',
  authenticated,
  checkUserOwnership,
  userController.editUser
)
router.put(
  '/users/:id',
  authenticated,
  checkUserOwnership,
  upload.single('image'),
  userController.putUser
)
router.get('/users/:id', authenticated, userController.getUser)

// Set restaurants page
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.post('/comments', authenticated, commentController.postComment)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

// Export router
module.exports = router
