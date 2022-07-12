// FilePath: routes/index.js
// Include modules
const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// Router settings
// admins
router.use('/admin', authenticatedAdmin, admin)
// users
router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
// restaurants
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
// fallback
router.use('/', generalErrorHandler)

module.exports = router
