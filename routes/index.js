const express = require('express')
const router = express.Router()
const passport = require('../config/passport') // 引入 Passport，需要他幫忙做驗證
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const {
  authenticated
} = require('../middleware/auth')
const restController = require('../controllers/restaurant-controller')
const {
  generalErrorHandler
} = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn) // 注意是 Post
router.get('/logout', userController.logout)
router.get('/restaurants', authenticated, restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
