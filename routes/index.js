const express = require('express')
const router = express.Router()
// 套件
const passport = require('../config/passport')
// Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
// middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
// Error handler (middle)
const { generalErrorHandler } = require('../middleware/error-handler')
// 後台
const admin = require('./modules/admin')
router.use('/admin', authenticatedAdmin, admin)

// 前台
// 登入登出註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logOut)
// 瀏覽頁面
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurantDetail)
router.get('/restaurants', authenticated, restController.getRestaurants)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('/', (req, res) => res.redirect('/restaurants'))

// 發生 Error
router.use('/', generalErrorHandler)

module.exports = router
