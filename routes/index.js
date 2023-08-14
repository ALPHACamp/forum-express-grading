const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

// 後台
router.use('/admin', authenticatedAdmin, admin)

// 註冊頁
router.get('/signup', userController.signUpPage)
// 提交註冊
router.post('/signup', userController.signUp)

// 登入頁
router.get('/signin', userController.signInPage)
// 登入驗證
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  // 驗證結果
  userController.signIn
)

// 登出
router.get('/logout', userController.logout)

// 瀏覽編輯 Profile 頁面
router.get('/users/:id/edit', authenticated, userController.editUser)
// 瀏覽 Profile
router.get('/users/:id', authenticated, userController.getUser)
// 編輯 Profile
router.put(
  '/users/:id',
  authenticated,
  upload.single('image'),
  userController.putUser
)

// feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

// Dashboard
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)

// 前台首頁單獨餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
// 前台首頁
router.get('/restaurants', authenticated, restController.getRestaurants)

// 刪除評論
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
)
// 提交評論
router.post('/comments', authenticated, commentController.postComment)

// 設定 fallback 路由, 其他路由條件都不符合時，最終會通過的路由，將使用者重新導回 /restaurants
router.use('/', (req, res) => res.redirect('/restaurants'))

// err
router.use('/', generalErrorHandler)

module.exports = router
