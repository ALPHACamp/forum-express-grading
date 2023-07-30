const express = require('express')
const router = express.Router()

// 引入controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

// 引入工具函式
const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// 引入子路由
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage) // (頁面)註冊
router.post('/signup', userController.signUp) // (功能)註冊
router.get('/signin', userController.signInPage) // (頁面)登入
router.post('/signin', passport.authenticate('local', // (功能)登入
  { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/restaurants', authenticated, restController.getRestaurants) // (頁面)首頁-餐廳瀏覽

// fallback路由，當其他條件都不符合，最終都會通過這一條
router.use('/', (req, res) => res.redirect('/restaurants'))

// Error handler
router.use('/', generalErrorHandler)

module.exports = router
