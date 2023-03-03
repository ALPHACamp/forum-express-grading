const express = require('express')
const router = express.Router()
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const uploadImage = require('../middleware/multer')

// 後台
const admin = require('./modules/admin')
router.use('/admin', authenticatedAdmin, admin)

// 前台
const userController = require('../controllers/user-controller')
const restController = require('../controllers/restaurant-controller')
const commentController = require('../controllers/​​comment-controller')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', userController.signIn)
router.get('/logout', userController.logOut)

router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, uploadImage, userController.putUser)

router.post('/favorite/:id', authenticated, userController.addFavorite)
router.delete('/favorite/:id', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/following/:id', authenticated, userController.addFollowing)
router.delete('/following/:id', authenticated, userController.removeFollowing)

router.get('*', (req, res) => res.redirect('/restaurants')) // fallback

router.use('/', generalErrorHandler)

module.exports = router
