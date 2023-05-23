const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const passport = require('../config/passport')
const admin = require('./modules/admin')
const commentController = require('../controllers/comment-controller')
const upload = require('../middleware/multer')

// 後台
router.use('/admin', authenticatedAdmin, admin)
// 註冊
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 登入登出
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
// 刪除評論管理員限定
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
// 新增評論
router.post('/comments', authenticated, commentController.postComment)
// 使用者收藏或刪除收藏餐廳
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// 使用者like或unlike餐廳
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// 使用者追蹤或取消追蹤
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)
// 美食達人頁面
router.get('/users/top', authenticated, userController.getTopUsers)
// 瀏覽使用者編輯頁面
router.get('/users/:id/edit', authenticated, userController.editUser)
// 編輯使用者個人頁面功能
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
// 瀏覽使用者個人頁面
router.get('/users/:id', authenticated, userController.getUser)
// 瀏覽最新動態
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
// 瀏覽儀錶板
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
// 瀏覽單一餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// 瀏覽所有餐廳
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
// 錯誤處理
router.use('/', generalErrorHandler)
module.exports = router
