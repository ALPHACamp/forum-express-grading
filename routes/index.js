const express = require('express')
const router = express.Router()
// 套件
const passport = require('../config/passport')
// Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
// middleware
const { authenticated } = require('../middleware/auth')
// Error handler (middle)
const { generalErrorHandler } = require('../middleware/error-handler')
// 後台
const admin = require('./modules/admin')
router.use('/admin', admin)

// 前台
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), userController.logIn)
router.get('/logout', userController.logOut)
router.get('/restaurants', authenticated, restController.getRestaurants)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('/', (req, res) => res.redirect('/restaurants'))

// 發生 Error
router.use('/', generalErrorHandler)

module.exports = router
