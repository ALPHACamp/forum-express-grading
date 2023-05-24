const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const admin = require('./modules/admin')

// admin
router.use('/admin', authenticatedAdmin, admin)

// signup
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

// signin
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

// logout
router.get('/logout', userController.logout)

// TopUser
router.get('/users/top', authenticated, userController.getTopUsers)

// profile
router.get('/users/:id/edit', userController.editUser)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', userController.putUser)

// feeds
router.get('/restaurants/feeds', authenticated, restController.getFeeds)

// dashboard
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

// restaurants
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

// comments
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

// like
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/like/:restaurantId', authenticated, userController.addLike)

// favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

// followShip
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
