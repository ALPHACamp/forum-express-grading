const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
const admin = require('./modules/admin') // 載入 admin.js
const restController = require('../controllers/restaurant-controller') // 載入restaurant
const userController = require('../controllers/user-controller') // 載入user
const commentController = require('../controllers/comment-controller') // 載入comment
const upload = require('../middleware/multer') // 載入upload讓multer處理檔案
const { authenticated, authenticatedAdmin } = require('../middleware/auth') // 引入auth.js
const { generalErrorHandler } = require('../middleware/error-handler') // 載入error-handler

router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 用post

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/users/:id', userController.getUser)
router.put('/users/:id', upload.single('image'), userController.putUser)
router.get('/users/:id/edit', userController.editUser)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/comments', authenticated, commentController.postComment)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
