const express = require('express')
const router = express.Router()
const adminRoute = require('./modules/admin')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const CommentController = require('../controllers/comment-controller')
const generalErrorHandler = require('../middleware/error-handler').generalErrorHandler
const passport = require('passport')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// user
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local',
  { failureRedirect: '/signin', failureFlash: true }),
userController.signIn)
router.get('/logout', userController.logout)
// admin
router.use('/admin', authenticatedAdmin, adminRoute)
// restaurnat
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restaurantController.getDashboard)
// comment
router.post('/comments', authenticated, CommentController.postComment)
router.delete('/comments/:id', authenticated, CommentController.deleteComment)
router.get('/', (req, res) => { res.redirect('/restaurants') })
router.use('/', generalErrorHandler)
module.exports = router
