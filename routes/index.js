const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const admin = require('./modules/admin')
const passport = require('passport')

router.use('/admin', authenticatedAdmin, admin)

// router順序非常重要，條件越複雜的越要往上放，讓程式先判斷
// register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

// sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// logout
router.get('/logout', userController.logout)

// show index
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/', (req, res) => { res.redirect('/restaurants') })

// error handler
router.use('/', generalErrorHandler)

module.exports = router
