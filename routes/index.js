const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const UserController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handeler')
const passport = require('../config/passport')

router.use('/admin', admin)
router.get('/signup', UserController.signUpPage)
router.post('/signup', UserController.signUp)
router.get('/signin', UserController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), UserController.signIn)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants')) // fallback route
router.use('/', generalErrorHandler)

module.exports = router
