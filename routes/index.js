const express = require('express')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const passport = require('../config/passport')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')

// admin
router.use('/admin', authenticatedAdmin, admin)

// user signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// user signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

// user logout
router.get('/logout', userController.logout)

// restaurant index
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

// restaurant detail
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

router.use('/', generalErrorHandler)

module.exports = router
