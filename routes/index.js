const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler') // 使用{}是為了提取../middleware/error-handler內的解構賦值(function跑完後的值)，若沒加上{}會直接匯入整個function

const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)
// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 登入
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 收到post先用passport認證，認證失敗帶回/signin並傳送失敗flash message，認證成功帶入passport的序列化/反序列化程序
// 登出
router.get('/logout', userController.logout)
// 主頁
router.get('/restaurants/:id/dashboard', restController.getDashboard) // 詳細頁面儀錶板
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 詳細頁面
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
