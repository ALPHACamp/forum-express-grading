const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// 管理者首頁
router.use('/admin', authenticatedAdmin, admin)

// 使用者註冊頁面
router.get('/signup', userController.signUpPage)

// 使用者註冊
router.post('/signup', userController.signUp)

// 使用者登入頁面
router.get('/signin', userController.signInPage)

// 使用者登入
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }), userController.signIn)

// 使用者登出
router.get('/signout', userController.signout)

// 使用者查看單筆資料的 Dashboard
router.get('/restaurants/:id/dashboard', restController.getDashboard)

// 使用者查看單筆資料
router.get('/restaurants/:id', restController.getRestaurant)

// 使用者登入後餐廳首頁
router.get('/restaurants', authenticated, restController.getRestaurants)

// 刪除評論
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// 使用者新增評論
router.post('/comments', authenticated, commentController.postComment)

// 使用者編輯資訊頁面
router.get('/users/:id/edit', userController.editUser)

// 使用者編輯資訊
router.put('/users/:id', userController.putUser)

// 瀏覽使用者頁面
router.get('/users/:id', authenticated, userController.getUser)

// 當所有路由都不符合時自動導向餐廳首頁
router.use('', (req, res) => res.redirect('/restaurants'))

// 錯誤訊息處理
router.use('/', generalErrorHandler)

module.exports = router
