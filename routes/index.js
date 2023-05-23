const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
// 引入controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
// 引入middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
// 後台
const admin = require('./modules/admin')
router.use('/admin', authenticatedAdmin, admin)
// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
// 登出
router.get('/logout', userController.logout)
// 餐廳頁
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => { res.redirect('/restaurants') })
router.use('/', generalErrorHandler)

module.exports = router
