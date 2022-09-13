const express = require('express')
const router = express.Router()
const adminRoute = require('./modules/admin')
const restaurantController = require('../controller/restaurant-controller')
const userController = require('../controller/user-controller')
const generalErrorHandler = require('../middleware/error-handler').generalErrorHandler
const passport = require('passport')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local',
  { failureRedirect: '/signIn', failureFlash: true }),
userController.signIn)
router.get('/logout', userController.logout)
router.use('/admin', adminRoute)
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurants') })

router.use('/', generalErrorHandler)
module.exports = router
