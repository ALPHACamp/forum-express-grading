const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const admin = require('./modules/admin')

// 後台
router.use('/admin', admin)
// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 登入登出
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
// 前台
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
// 錯誤處理
router.use('/', generalErrorHandler)
module.exports = router
