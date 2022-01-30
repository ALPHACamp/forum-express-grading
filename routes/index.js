const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')

const restaurantController = require('../controllers/restaurant-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)

router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

router.get('/signout', userController.signOut)

router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
