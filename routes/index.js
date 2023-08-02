const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
// 用：可以重新命名
const restController = require('../controllers/restaurant-controller')
const { userController } = require('../controllers/user-controller')
const generalErrorHandler = require('../middlewares/error-handler')
const { authenticated, authenticatedAdmin } = require('../middlewares/auth')

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.use('/admin', authenticatedAdmin, admin)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants', authenticated, restController.getRestaurants) // 只有這行需要加authenticated，剩下的不用
router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

/* Error handleling, to middleware with err at the begin of argument */
router.use('/', generalErrorHandler)

module.exports = router
