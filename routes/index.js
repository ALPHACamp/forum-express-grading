const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller')
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')

const { generalErrorHandler } = require('../middleware/error-handler')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/', (req, res) => {
  res.redirect('/restaurants')
})
router.use('/', generalErrorHandler)

module.exports = router
