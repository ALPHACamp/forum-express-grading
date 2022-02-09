const express = require('express')
const passport = require('passport')
const router = express.Router()

const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

const admin = require('./modules/admin')
const users = require('./modules/users')
const restaurants = require('./modules/restaurants')
const comments = require('./modules/comments')

router.use('/admin', authenticatedAdmin, admin)
router.use('/users', authenticated, users)
router.use('/restaurants', authenticated, restaurants)
router.use('/comments', comments)

// Favorite
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
)

// Like
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin',
  passport.authenticate('local',
    {
      failureRedirect: '/signin',
      failureFlash: true
    }), userController.signIn)
router.get('/logout', userController.logout)

// Fallback route, if there is no match route from top to bottom, redirect this route
router.use('/', (req, res) => res.redirect('/restaurants'))

// Error handling
router.use('/', generalErrorHandler)

module.exports = router
