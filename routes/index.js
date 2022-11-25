const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')

// admin
router.use('/admin', admin)

// sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// main page
router.get('/restaurants', restaurantController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

// handle error
router.use('/', generalErrorHandler)

module.exports = router
