const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/restaurants/:rest_id/dashboard', authenticated, restController.getDashboard) // render a dashboard
router.get('/restaurants/:rest_id', authenticated, restController.getRestaurant) // render a restaurant
router.get('/restaurants', authenticated, restController.getRestaurants) // render all restaurants
router.post('/comments', authenticated, commentController.postComment) // create a new comment into database
router.get('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)
module.exports = router
