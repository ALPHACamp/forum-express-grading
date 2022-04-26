const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const admin = require('./module/admin')

const upload = require('../middleware/multer')

const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUP)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logOut)

router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', upload.single('image'), authenticated, userController.putUser)

router.get('/restaurants/:id/dashboard', authenticated, restaurantController.getDashboard)
router.get('/restaurants/feeds', authenticated, restaurantController.getFeeds)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)

router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/like/:restaurantId', authenticated, userController.addLike)

router.delete('/following/:userId', authenticated, userController.removeFollowing)
router.post('/following/:userId', authenticated, userController.addFollowing)

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
