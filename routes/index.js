const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const upload = require('../middleware/multer')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// 後台
router.use('/admin', authenticatedAdmin, admin)

// 登入畫面
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// profile
router.get('/users/top', authenticated, userController.getTopUsers)// top user page
router.get('/users/:id', authenticated, userController.getUser) // profile page
router.get('/users/:id/edit', authenticated, userController.editUser) // edit page
router.put('/users/:id', upload.single('image'), userController.putUser) // edit profile

// 前台

router.get('/restaurants/feeds', authenticated, restController.getFeeds) // feeds page
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // detail
router.get('/restaurants', authenticated, restController.getRestaurants) // browse all
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // dashboard
router.post('/comments', authenticated, commentController.postComment) // comment
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // delete comment(加入管理者權限驗證)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite) // add to Fav list
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite) // remove from Fav list
router.post('/like/:restaurantId', authenticated, userController.addLike) // like
router.delete('/like/:restaurantId', authenticated, userController.removeLike) // unlike
router.post('/following/:userId', authenticated, userController.addFollowing) // follow
router.delete('/following/:userId', authenticated, userController.removeFollowing) // unfollow
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
