const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// admin
router.use('/admin', authenticatedAdmin, admin)

// sign up, sign in, logout
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
// restaurants
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.use('/', (req, res) => res.redirect('/restaurants'))

// error
router.use('/', generalErrorHandler)

module.exports = router
