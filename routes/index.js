const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// 後台
const admin = require('./modules/admin')
router.use('/admin', authenticatedAdmin, admin)

// 前台
const userController = require('../controllers/user-controller')
const restController = require('../controllers/restaurant-controller')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', userController.signIn)
router.get('/logout', userController.logOut)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.get('*', (req, res) => res.redirect('/restaurants')) // fallback

router.use('/', generalErrorHandler)

module.exports = router
