const express = require('express')
const router = express.Router()
// 套件
const passport = require('../config/passport')
// Controllers
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

// middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const upload = require('../middleware/multer')
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
router.get('/users/top', authenticated, userController.getTopUsers) // 最多追蹤的使用者
// 使用者 Profile
router.get('/users/:id/edit', authenticated, userController.editUser) // 瀏覽編輯頁
router.get('/users/:id', authenticated, userController.getUser) // 單純瀏覽Profile頁面
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser) // 更新資料
// 瀏覽頁面
router.get('/restaurants/top', authenticated, restController.getTopRestaurants) // Top 10 餐廳
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurantDetail)
router.get('/restaurants', authenticated, restController.getRestaurants)
// 評論
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 若為管理員才可以刪除
// 最愛清單
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// 按讚清單
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// 追蹤使用者
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('/', (req, res) => res.redirect('/restaurants'))

// 發生 Error
router.use('/', generalErrorHandler)

module.exports = router
