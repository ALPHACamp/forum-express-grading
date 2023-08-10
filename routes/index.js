const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const admin = require('./modules/admin')
const upload = require('../middleware/multer')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin, authenticatedProfile } = require('../middleware/auth')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)

router.get('/users/:id/edit', authenticatedProfile, userController.editUser)
router.put('/users/:id', authenticatedProfile, upload.single('image'), userController.putUser)
router.get('/users/:id', authenticatedProfile, userController.getUser)

router.delete('/comments/:id', authenticated, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.get('/restaurants/:id/dashboard', restController.getDashboard)
router.get('/restaurants/:id', restController.getRestaurant)


router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
