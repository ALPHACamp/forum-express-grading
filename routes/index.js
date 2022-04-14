const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./module/admin')

const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUP)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logOut)

router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
