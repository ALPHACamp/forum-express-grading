const express = require('express')
const router = express.Router()
// passport will authenticate user's identity in the router post('/signin')
// if user pass this authentication, this user's request will be sent to controller 'signIn'
const passport = require('../config/passport')
const admin = require('./modules/admin')

// import controller modules
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }),
  userController.signIn
)
router.get('/logout', userController.logout)

/**
 * as server gets request `/restaurants`
 * this request will go through middleware `authenticated`
 * pass authentication process,
 * this request will be passed to the function `getRestaurants` which is in object restaurantController
 */
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.post('/comments', authenticated, commentController.postComment)

/**
 * set fallback router
 * if all routers above are not allow to get into, this fallback router is the only one to enter
 */
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
