const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restaurantController = require('../controllers/restaurant-controller.js')
const userController = require('../controllers/user-controller.js')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/logout', userController.logout)

router.use('/', generalErrorHandler)
router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
