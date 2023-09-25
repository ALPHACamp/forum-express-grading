const express = require('express')
const router = express.Router()
const passport = require('passport')

const admin = require('./modules/admin')

const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth-handler')
const { errorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)

router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureMessage: true
  }),
  userController.signIn
)

router.get('/logout', userController.logout)

router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restaurantController.getDashboard
)

router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)

router.get('/restaurants', authenticated, restaurantController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurants'))

router.post('/comments', authenticated, commentController.postComment)

router.delete('/comments/:id', authenticated, commentController.deleteComment)

router.get('/users/:id/edit', authenticated, userController.editUser)

router.get('/users/:id', authenticated, userController.getUser)

router.put('/users/:id', upload.single('image'), authenticated, userController.putUser)

router.use('/', errorHandler)

module.exports = router
