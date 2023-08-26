const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./modules/admin')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const upload = require('../middleware/multer')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// 管理者管理頁面
router.use('/admin', authenticatedAdmin, admin)
// 註冊登入部分
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local',
  {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn
)

router.get('/logout', userController.logout)
// 餐廳部分
router.get('/restaurants/feeds', authenticated, restController.getFeeds) // 注意順序
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// 使用者部分
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// 後期處理
router.use('/', (req, res) => { res.redirect('/restaurants') })

router.use('/', generalErrorHandler)

module.exports = router
