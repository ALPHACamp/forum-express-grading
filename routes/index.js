const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const admin = require('./modules/admin')
const restaurants = require('./modules/restaurants')
const comments = require('./modules/comments')
const users = require('./modules/users')

const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)
router.use('/restaurants', authenticated, restaurants)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.use('/comments', authenticated, comments)
router.use('/users', authenticated, users)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
