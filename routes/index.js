const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

// admin
router.use('/admin', admin)

// sign up, sign in, logout
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

// restaurants
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

// error
router.use('/', generalErrorHandler)

module.exports = router
