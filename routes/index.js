const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

// 後台
const admin = require('./modules/admin')
router.use('/admin', admin)

// 前台
const userController = require('../controllers/user-controller')
const restaurantController = require('../controllers/restaurant-controller')
const authController = require('../controllers/auth-controller')

router.get('/auth/facebook/callback', authController.facebookCallback)
router.get('/auth/facebook', authController.facebookSignin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', userController.signIn)
router.get('/logout', userController.logOut)

router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.get('*', (req, res) => res.redirect('/restaurants')) // fallback

router.use('/', generalErrorHandler)

module.exports = router
