const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')
const passport = require('../config/passport')

// admin
router.use('/admin', admin)

// sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// logout
router.get('/logout', userController.logout)

// main page
router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

// handle error
router.use('/', generalErrorHandler)

module.exports = router
