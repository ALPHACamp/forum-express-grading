const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurants-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/auth')

router.use('/restaurants', authenticated, restController.getRestaurants)
router.use('/admin', admin)
router.get('/signup', userController.signupPage)
router.post('/signup', userController.signup)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
