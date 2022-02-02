const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handlers')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/sign',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurant)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
