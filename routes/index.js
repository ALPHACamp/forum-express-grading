const express = require('express')

const router = express.Router()

const passport = require('../config/passport')

// 新增，載入 controller

const restController = require('../controllers/restaurant-controller')

const userController = require('../controllers/user-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', badRequestMessage: '信箱及密碼皆不得為空', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
