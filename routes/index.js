const express = require('express')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const passport = require('../config/passport')
const router = express.Router()
const upload = require('../middleware/multer')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')

// admin
router.use('/admin', authenticatedAdmin, admin)

// user signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// user signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

// user logout
router.get('/logout', userController.logout)

// restaurant index
router.get('/restaurants', authenticated, restController.getRestaurants)

// restaurant feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

// restaurant top
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)

// restaurant detail
router.get('/restaurants/:id', authenticated, restController.getRestaurant)

// restaurant dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// comment create
router.post('/comments', authenticated, commentController.postComment)

// comment delete
router.delete('/comments/:id', authenticated, commentController.deleteComment)

// favorite create & delete
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// like create & delete
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

// following create & delete
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

// user top-users
router.get('/users/top', authenticated, userController.getTopUsers)

// user profile
router.get('/users/:id', authenticated, userController.getUser)

// user profile edit
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
