const express = require('express')

const router = express.Router()
const passport = require('../config/passport')

//* 載入middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
//* 載入子路由
const admin = require('./modules/admin')
const users = require('./modules/users')

//* 載入controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/​​comment-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
//* 後台
router.use('/admin', authenticatedAdmin, admin)
//* 使用者
router.use('/users', authenticated, users)

//* 使用者
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)
//* 最新動態
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
//* 瀏覽全部餐廳
router.get('/restaurants', authenticated, restController.getRestaurants)
//* 瀏覽單一餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
//* 瀏覽單一餐廳數據
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)

//* 新增餐廳評論
router.post('/comments', authenticated, commentController.postComment)
//* 刪除餐廳評論
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
