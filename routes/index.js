const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('../routes/modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { authenticatedAdmin, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', generalErrorHandler) // 加入這行

module.exports = router
