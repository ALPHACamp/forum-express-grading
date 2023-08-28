const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', authenticatedAdmin, admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp) // 注意用 post
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn) // 注意是 post
router.get('/logout', userController.logout)
router.get('/restaurants', authenticated, restController.getRestaurants)

// fallback 路由是指其他路由條件都不符合時，最終會通過的路由。也就是說，當程式一路由上而下執行，萬一都匹配不到和請求相符的路徑，此時不論此 request 是用哪個 HTTP method 發出的，都會匹配到這一行，將使用者重新導回 /restaurants
router.use('/', (req, res) => res.redirect('/restaurants')) // ?
router.use('/', generalErrorHandler)

module.exports = router
