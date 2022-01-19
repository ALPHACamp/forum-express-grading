const express = require('express')
const passport = require('passport')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin',
  passport.authenticate('local',
    {
      failureRedirect: '/signin',
      failureFlash: true
    }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/restaurants', authenticated, restController.getRestaurants)

// Fallback route, if there is no match route from top to bottom, redirect this route
router.use('/', (req, res) => res.redirect('/restaurants'))

// Error handling
router.use('/', generalErrorHandler)

module.exports = router
