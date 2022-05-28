const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }, userController.signIn))
router.get('/logout', userController.logout)
router.get('/restaurants', restaurantController.getRestaurants)
router.use('/', generalErrorHandler)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
