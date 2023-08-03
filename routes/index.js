const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// import controllers
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// import middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

router.get('/restaurants/:id/dashboard', authenticated, restaurantController.getDashboard)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

// error handler
router.use('/', generalErrorHandler)

module.exports = router
