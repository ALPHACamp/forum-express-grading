const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')

// 管理者首頁
router.use('/admin', admin)

// 使用者註冊頁面
router.get('/signup', userController.signUpPage)

// 使用者註冊
router.post('/signup', userController.signUp)

// 使用者登入頁面
router.get('/signin', userController.signInPage)

// 使用者登入
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }), userController.signIn)

// 使用者登入後餐廳首頁
router.get('/restaurants', restController.getRestaurants)

// 自動導向餐廳首頁
router.use('/', (req, res) => res.redirect('/restaurants'))

// 錯誤訊息處理
router.use('/', generalErrorHandler)

module.exports = router
