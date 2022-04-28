const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const userController = require('../controllers/user-controller')
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const admin = require('./modules/admin')
const users = require('./modules/users')
const restaurants = require('./modules/restaurants')
const comments = require('./modules/comments')
//
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
//
router.use('/admin', authenticatedAdmin, admin)
//
router.use('/users', authenticated, users)
//
router.use('/restaurants', authenticated, restaurants)
//
router.use('/comments', comments)
//
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
//
module.exports = router
