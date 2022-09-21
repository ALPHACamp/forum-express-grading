const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const commentController = require('../controllers/comment-controller')

const { generalErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')

// 後台
router.use('/admin', authenticatedAdmin, admin)

// 登入畫面
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)
router.get('/logout', userController.logout)

// 前台
router.get('/restaurants/:id', authenticated, restController.getRestaurant) // detail
router.get('/restaurants', authenticated, restController.getRestaurants) // browse all
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard) // dashboard
router.post('/comments', authenticated, commentController.postComment) // comment
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // delete comment(加入管理者權限驗證)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
