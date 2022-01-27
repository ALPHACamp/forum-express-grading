const express = require('express')
const router = express.Router()

// passport middleware
const passport = require('../config/passport')

// 引用錯誤處理 middleware
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')

// 管理員
router.use('/admin', authenticatedAdmin, admin)

// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// 登出
router.get('/logout', userController.logout)

// 首頁
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))

// 錯誤處理 middleware
router.use('/', generalErrorHandler)

module.exports = router
