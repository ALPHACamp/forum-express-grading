const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const { upload2Memory } = require('../middleware/multer')
const userController = require('../controllers/user-controller')
const restaurantController = require('../controllers/restaurant-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.getSignUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.getSignInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signin)
router.get('/logout', userController.logout)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload2Memory.single('image'), userController.putUser)
router.get('/users/:id', authenticated, userController.getUser)

router.get('/restaurants/feeds', authenticated, restaurantController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restaurantController.getDashboard)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.post('/favorite/:id', authenticated, restaurantController.addFavorite)
router.delete('/favorite/:id', authenticated, restaurantController.removeFavorite)

router.post('/following/:id', userController.addFollowing)
router.delete('/following/:id', userController.removeFollowing)

router.post('/like/:id', authenticated, restaurantController.addLike)
router.delete('/like/:id', authenticated, restaurantController.removeLike)

router.get('/', (_req, res) => {
  res.redirect('/restaurants')
})

router.use('/', generalErrorHandler)
module.exports = router
