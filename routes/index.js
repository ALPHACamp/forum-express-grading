const router = require('express').Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.getSignUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.getSignInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)
router.use('/', (req, res) => res.redirect('restaurants'))

// error handler
router.use(generalErrorHandler)

module.exports = router
