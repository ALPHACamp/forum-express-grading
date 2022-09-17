const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const adminRouter = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const passport = require('../config/passport')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.use('/admin', authenticatedAdmin, adminRouter)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.get('/', (req, res) => {
  res.redirect('/restaurants')
})

router.use('/', generalErrorHandler)
module.exports = router
