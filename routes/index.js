const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const upload = require('../middleware/multer')

const admin = require('./modules/admin')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

//! 之後來試試調整上下順序 (教案說只要符合條件就會停，我以前試的狀況好像要 "完全符合")
// router.get('/', (req, res) => res.send('I am so happy'))
router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser) // 顯示使用者編輯頁面
router.get('/users/:id', authenticated, userController.getUser) // 顯示使用者資料
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser) // 送出使用者更新資料

router.get('/restaurants/top', authenticated, restController.getTopRestaurants) // 顯示前十餐廳 (最愛數量)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // 顯示 dashboard
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // 顯示單一餐廳
router.get('/restaurants', authenticated, restController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', (req, res) => res.redirect('/restaurants')) //! 教案說要改成這樣，我先試試上面的
router.use('/', generalErrorHandler)
// (上1) 其實加在前後都沒啥關係，因為 error handler 在 express 是另一類別，會另外處理

module.exports = router
