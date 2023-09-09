const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const userController = require('../controllers/user-controller')
const restaurantController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.getSignUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.getSignInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
router.get('/logout', userController.logout)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/', (_req, res) => {
  res.redirect('/restaurants')
})

router.use('/', generalErrorHandler)
module.exports = router
