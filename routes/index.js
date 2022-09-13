const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入Passport,透過他幫忙做驗證
const admin = require('./modules/admin')// 載入 admin.js
const restController = require('../controllers/restaurant-controller')// 載入 controller
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth') // 引入 auth.js
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

// 新增前台網址路由//匹配條件多的路由要寫在前面
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
