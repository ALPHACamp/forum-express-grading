const express = require('express')
const router = express.Router()

const passport = require('../config/passport') // 導入登入提示狀態

const admin = require('./modules/admin') // 導入後台管理

const restController = require('../controllers/restaurant-controller') // 導入餐廳控制
const userController = require('../controllers/user-controller') // 導入使用者控制
const commentController = require('../controllers/comment-controller') // 導入評論控制
const upload = require('../middleware/multer') // 導入middleware

const { authenticated, authenticatedAdmin, authenticatedProfile } = require('../middleware/auth') // 導入登入驗證,新增後台管理驗證

const { generalErrorHandler } = require('../middleware/error-handler') // 導入錯誤訊息提示

router.use('/admin', authenticatedAdmin, admin) // 一開始就做後台管理驗證

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 加入登入錯誤等提示

router.get('/logout', userController.logout) // 登出路由

router.get('/users/top', authenticated, userController.getTopUsers) // 美食達人
router.get('/users/:id/edit', authenticated, authenticatedProfile, userController.editUser) // 編輯個人首頁頁面
router.get('/users/:id', authenticated, userController.getUser) // 瀏覽個人首頁
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser) // 修改個人首頁

router.get('/restaurants/feeds', authenticated, restController.getFeeds) // 最新動態路由

router.get('/restaurants/top', authenticated, restController.getTopRestaurants) // 人氣餐廳路由

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // dashboard路由
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 瀏覽單筆餐廳路由
router.get('/restaurants', authenticated, restController.getRestaurants) // 瀏覽所有餐廳並導入登入狀態驗證

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 評論刪除路由
router.post('/comments', authenticated, commentController.postComment) // 評論路由

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite) // 點最愛路由
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite) // 收回最愛路由

router.post('/like/:restaurantId', authenticated, userController.addLike) // 點like路由
router.delete('/like/:restaurantId', authenticated, userController.removeLike) // 收回like路由

router.post('/following/:userId', authenticated, userController.addFollowing) // 追蹤路由
router.delete('/following/:userId', authenticated, userController.removeFollowing) // 退追路由

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
