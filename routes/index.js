const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
// for image upload
const upload = require('../middlewares/multer')
// 用：可以重新命名
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const generalErrorHandler = require('../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../middlewares/auth')
const { blockEditFromOtherUser } = require('../middlewares/user-helper')

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.use('/admin', authenticatedAdmin, admin)

/* user */
router.get('/users/top', authenticated, userController.getTopUsers) // for following界面
router.get('/users/:id/edit', authenticated, blockEditFromOtherUser, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, blockEditFromOtherUser, upload.single('image'), userController.putUser)

router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants) // 只有這行需要加authenticated，剩下的不用

/* comment */
router.delete('/comments/:id', authenticated, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

/* favorite  */
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

/* like */
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

/* follow */
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

/* Error handleling, to middleware with err at the begin of argument */
router.use('/', generalErrorHandler)

module.exports = router
