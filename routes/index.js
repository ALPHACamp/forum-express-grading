const express = require('express')
const passport = require('../config/passport')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const {
  authenticated,
  authenticatedAdmin,
  authenticatedUser
} = require('../middleware/auth')
const upload = require('../middleware/multer')
const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)
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

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticatedUser, userController.editUser)
router.put(
  '/users/:id',
  authenticatedUser,
  upload.single('image'),
  userController.putUser
)
router.get('/users/:id', authenticated, userController.getUser)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.delete(
  '/comments/:id',
  authenticatedAdmin,
  commentController.deleteComment
)
router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
