const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
// 引入controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
// 引入middleware
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin')
router.use('/admin', admin)

router.get('/signup', userController.signUpPage)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.post('/signup', userController.signUp)

router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => { res.redirect('/restaurants') })
router.use('/', generalErrorHandler)

module.exports = router
