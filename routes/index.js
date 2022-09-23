const express = require('express')
const router = express.Router()
const adminRoute = require('./modules/admin')
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const CommentController = require('../controllers/comment-controller')
const generalErrorHandler = require('../middleware/error-handler').generalErrorHandler
const passport = require('passport')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')
const uerController = require('../controllers/user-controller')
const upload = require('../middleware/multer')

// user
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local',
  { failureRedirect: '/signin', failureFlash: true }),
userController.signIn)
router.get('/logout', authenticated, userController.logout)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/users/:id', authenticated, authenticatedUser, upload.single('image'), userController.putUser)
router.get('/users/:id/edit', authenticated, authenticatedUser, uerController.editUser)
// admin
router.use('/admin', authenticatedAdmin, adminRoute)
// restaurnat
router.get('/restaurants', authenticated, restaurantController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restaurantController.getFeeds)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restaurantController.getDashboard)
// comment
router.post('/comments', authenticated, CommentController.postComment)
router.delete('/comments/:id', authenticated, CommentController.deleteComment)
router.get('/', (req, res) => { res.redirect('/restaurants') })
router.use('/', generalErrorHandler)
module.exports = router
