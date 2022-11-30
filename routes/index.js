const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const admin = require('./modules/admin')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)

// 註冊登入page
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)

// passport驗證成功才會userController.signIn
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureMessage: true }), userController.signIn)
router.get('/logout', userController.logout)

// 顯示restaurants畫面
router.get('/restaurants/:id/dashboard', restController.getDashboard)// 顯示dashboard
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
