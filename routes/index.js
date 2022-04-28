const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/​​comment-controller')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { authorizedUser } = require('../middleware/authorization')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')
const admin = require('./modules/admin')
const passport = require('../config/passport')

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin', failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id/edit', userController.editUser)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', authorizedUser, upload.single('image'), userController.putUser)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
