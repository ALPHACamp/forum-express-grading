const express = require('express')
const router = express.Router()

const passport = require('../config/passport.js')

const admin = require('./modules/admin.js')
const restaurants = require('./modules/restaurants.js')
const comments = require('./modules/comments.js')
const users = require('./modules/users.js')
const favorites = require('./modules/favorites.js')

const userController = require('../controllers/user-controller.js')

const { authenticated, authenticatedAdmin } = require('../middleware/auth.js')
const { generalErrorHandler } = require('../middleware/error-handler.js')

router.use('/admin', authenticatedAdmin, admin)

router.use('/restaurants', authenticated, restaurants)

router.use('/comments', authenticated, comments)

router.use('/users', authenticated, users)

router.use('/favorites', authenticated, favorites)

router.get('/signup', userController.signUpPage)

router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)

router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin' }), userController.signIn)

router.get('/logout', userController.signOut)

router.get('/', (req, res) => res.redirect('/restaurants'))

router.use(generalErrorHandler)

module.exports = router
