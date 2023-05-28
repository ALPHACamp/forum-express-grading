const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler') // 使用{}是為了提取../middleware/error-handler內的解構賦值(function跑完後的值)，若沒加上{}會直接匯入整個function
const admin = require('./modules/admin')
const upload = require('../middleware/multer')

// admin
router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage) // 註冊
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage) // 登入
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 收到post先用passport認證，認證失敗帶回/signin並傳送失敗flash message，認證成功帶入passport的序列化/反序列化程序
router.get('/logout', userController.logout) // 登出
router.get('/users/top', authenticated, userController.getTopUsers) // 美食達人頁面
// 主頁
router.get('/restaurants/feeds', authenticated, restController.getFeeds) // feed頁面
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // 詳細頁面儀錶板
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 詳細頁面
router.get('/restaurants', authenticated, restController.getRestaurants) // 所有餐廳頁面
// comment
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 刪除評論
router.post('/comments', authenticated, commentController.postComment) // 評論
// favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// Like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// users
router.get('/users/:id/edit', authenticated, userController.editUser) // edit page
router.get('/users/:id', authenticated, userController.getUser) // users page
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser) // put edit
// follow
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
