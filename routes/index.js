const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

// 載入 Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// Middleware
const { generalErrorHandler } = require('../middleware/error-handler')

// Admin
const admin = require('./modules/admin')
router.use('/admin', admin)

// Sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// Log out
router.get('/logout', userController.logout)

router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
