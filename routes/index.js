const express = require('express')
const router = express.Router()
const restaurantController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const admin = require('./modules/admin')
const passport = require('passport')

router.use('/admin', authenticatedAdmin, admin)

// router順序非常重要，條件越複雜的越要往上放，讓程式先判斷
// register
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

// sign in
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

// logout
router.get('/logout', userController.logout)

// show index
router.get('/restaurants/:id/dashboard', authenticated, restaurantController.getDashboard)
router.get('/restaurants/:id', authenticated, restaurantController.getRestaurant)
router.get('/restaurants', authenticated, restaurantController.getRestaurants)

// comment
router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id ', authenticated, commentController.deleteComment)

// 設定 fallback route, 如果所有routes都不符合時，通過此路由
router.get('/', (req, res) => { res.redirect('/restaurants') })

// error handler
router.use('/', generalErrorHandler)

module.exports = router
