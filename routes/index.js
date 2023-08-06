const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')

// 載入 Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/​​comment-controller')

// Middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// Admin
router.use('/admin', authenticatedAdmin, admin)

// Sign up
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// Sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// Log out
router.get('/logout', userController.logout)

// Dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

// Comment
router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
