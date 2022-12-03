const express = require('express')
const router = express.Router()

const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證

// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller') // 新增這行
const commentController = require('../controllers/​​comment-controller') // 引入 controller
const { authenticated, authenticatedAdmin } = require('../middleware/auth')// 引入 auth.js
const { generalErrorHandler } = require('../middleware/error-handler')
// 載入 admin.js
const admin = require('./modules/admin')

router.use('/admin', authenticatedAdmin, admin)

// router.get('/', (req, res) => {
//   res.send('Hello World!')
// })

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants) // 修改這行，新增 authenticated 參數

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment) // 加入刪除的路由
router.post('/comments', authenticated, commentController.postComment) // 加入路由設定

router.use('/', (req, res) => res.redirect('/restaurants'))

router.use('/', generalErrorHandler)

module.exports = router
