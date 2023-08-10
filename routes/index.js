const express = require('express')
const router = express.Router()

// 引入controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

// 引入工具函式
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

// 引入子路由
const admin = require('./modules/admin')

// 管理介面路由
router.use('/admin', authenticatedAdmin, admin)

// sign up/sign in/logout相關
router.get('/signup', userController.signUpPage) // (頁面)註冊
router.post('/signup', userController.signUp) // (功能)註冊
router.get('/signin', userController.signInPage) // (頁面)登入
router.post('/signin', passport.authenticate('local', // (功能)登入
  { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout) // (功能)登出

// user profile相關
router.get('/users/:id', authenticated, userController.getUser) // (頁面)瀏覽Profile
router.get('/users/:id/edit', authenticated, userController.editUser) // (頁面)瀏覽編輯Profile
router.put('/users/:id', authenticated, upload.single('avatar'), userController.putUser) // (功能)編輯Profile

// favorite最愛相關
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// feeds最新消息
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

// restaurant瀏覽相關
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // (頁面)瀏覽單一餐廳的Dashboard
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // (頁面)瀏覽單一餐廳資料
router.get('/restaurants', authenticated, restController.getRestaurants) // (頁面)首頁-餐廳瀏覽

// comment相關
router.post('/comments', authenticated, commentController.postComment) // (功能)新增評論

// fallback路由，當其他條件都不符合，最終都會通過這一條
router.use('/', (req, res) => res.redirect('/restaurants'))

// Error handler
router.use('/', generalErrorHandler)

module.exports = router
