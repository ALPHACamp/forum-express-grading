const express = require('express')
const router = express.Router()
const passport = require('passport')

const admin = require('./modules/admin')

const restaurantController = require('../controllers/restaurants-controllers')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth-handler')
const { errorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureMessage: true
  }),
  userController.signIn
)

router.post('/logout', userController.logout)

router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurants'))

router.use('/', errorHandler)

module.exports = router
