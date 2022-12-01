const express = require('express')
const router = express.Router()
const passport = require('passport')
const admin = require('./modules/admin')
// 載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { authenticatedAdmin, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const upload = require('../middleware/multer')

// routes
router.use('/admin', authenticatedAdmin, admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

router.get('/logout', userController.logout)

router.get('/users/:id/edit', authenticated, userController.editUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants)
// 設定 fallback 路由(其他路由條件都不符合時，最終會通過的路由)
router.get('/', (req, res) => res.redirect('/restaurants'))

// setting Error message
router.use('/', generalErrorHandler)

module.exports = router
