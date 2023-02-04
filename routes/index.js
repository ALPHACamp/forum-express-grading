const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const restController = require('../controllers/restaurant-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('passport')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/logout', userController.logout)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))
// - 將其餘無對應路由導向restaurants頁面
router.use('/', generalErrorHandler)

module.exports = router
