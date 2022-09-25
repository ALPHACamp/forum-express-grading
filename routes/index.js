const express = require('express')
const router = express.Router()
const resController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const { authenticated, authenticatedAdmin, userAuthenticated } = require('../middleware/auth')
const commentController = require('../controllers/​​comment-controller')
const upload = require('../middleware/multer')

router.use('/admin', authenticatedAdmin, admin)
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', userAuthenticated, userController.editUser)
router.put('/users/:id', userAuthenticated, upload.single('image'), userController.putUser)
// login
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// restaurants
router.get('/restaurants/feeds', authenticated, resController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, resController.getDashboard)
router.get('/restaurants/:id', authenticated, resController.getRestaurant)
router.get('/restaurants', authenticated, resController.getRestaurants)
// comments
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)
// favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
// like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
// folloes
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
