const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handeler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const passport = require('../config/passport')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/logout', userController.logout)

router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/restaurants')) // fallback route
router.use('/', generalErrorHandler)

module.exports = router
