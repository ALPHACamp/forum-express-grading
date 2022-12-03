const express = require('express')
const router = express.Router()
const passport = require('passport')
const admin = require('./modules/admin')
// 載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
// 載入 middleware
const { authenticatedAdmin, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

// routes
router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 刪除評論，Admin才能刪
router.post('/comments', authenticated, commentController.postComment) // 新增餐廳評論

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite) // 新增收藏餐廳功能，動態路由取為:restaurantId
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite) // 移除收藏的餐廳

router.post('/like/:restaurantId', authenticated, userController.addLike) // 新增按Like功能，動態路由取為:restaurantId
router.delete('/like/:restaurantId', authenticated, userController.removeLike) // 移除Like

router.post('/following/:userId', authenticated, userController.addFollowing) // 新增追蹤User功能，動態路由取為:userId
router.delete('/following/:userId', authenticated, userController.removeFollowing) // 移除追蹤中的User

// 設定 fallback 路由(其他路由條件都不符合時，最終會通過的路由)
router.get('/', (req, res) => res.redirect('/restaurants'))

// setting Error message
router.use('/', generalErrorHandler)

module.exports = router
