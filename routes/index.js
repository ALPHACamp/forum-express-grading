const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const commentController = require('../controllers/comment-controller')

//

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.use('/admin', authenticatedAdmin, admin)
//
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

//
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

//

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
//
module.exports = router
