const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

const upload = require('../middleware/multer')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/users/:user_id/edit', authenticated, userController.editUser) // go to Profile edit page
router.get('/users/:user_id', authenticated, userController.getUser) // go to Profile page
router.put('/users/:user_id', authenticated, upload.single('image'), userController.putUser) // update Profile

router.get('/restaurants/feeds', authenticated, restController.getFeeds) // render top 10 feeds
router.get('/restaurants/:rest_id/dashboard', authenticated, restController.getDashboard) // render a dashboard
router.get('/restaurants/:rest_id', authenticated, restController.getRestaurant) // render a restaurant
router.get('/restaurants', authenticated, restController.getRestaurants) // render all restaurants

router.delete('/comments/:comment_id', authenticatedAdmin, commentController.deleteComment) // delete a comment by id
router.post('/comments', authenticated, commentController.postComment) // create a new comment into database
router.get('/', (req, res) => res.redirect('/restaurants'))

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite) // add a restaurant into join table
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite) // remove a restaurant from join table

router.post('/like/:restaurantId', authenticated, userController.addLike) // add a restaurant into join table
router.delete('/like/:restaurantId', authenticated, userController.removeLike) // remove a restaurant from join table

router.use('/', generalErrorHandler)
module.exports = router
