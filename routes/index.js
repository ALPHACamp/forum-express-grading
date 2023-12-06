const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller') // 載入 controller
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { authenticated } = require('../middleware/auth') // 引入用來驗證是否登入
const { authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')
const admin = require('./modules/admin')

// 身份驗證和註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// Admin 相關路由
router.use('/admin', authenticatedAdmin, admin)

// 具體用戶路由
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id/edit', authenticated, upload.single('image'), userController.putUser)
router.get('/users/:id', authenticated, userController.getUser)

// 餐廳路由
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', restController.getDashboard)
router.get('/restaurants/:id', restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

// 評論路由
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

// 最愛路由
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// like路由
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// Fallback 路由
router.use('/', (req, res) => res.redirect('/restaurants'))

// 通用錯誤處理器
router.use(generalErrorHandler)

module.exports = router
