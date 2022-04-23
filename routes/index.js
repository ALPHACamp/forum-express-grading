const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error_handler')
const passport = require('passport')
const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)
// signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
// logout
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
