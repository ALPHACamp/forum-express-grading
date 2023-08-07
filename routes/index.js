const express = require('express')
const passport = require('passport')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin',
  failureFlash: true
}), userController.signIn)

router.get('/logout', userController.logout)

router.get('/restaurants', restController.getRestaurants)

router.use('/', generalErrorHandler)

// fallback路由，當匹配不到時就會執行這一行
// 跟router.get的差別在於get只有限定'/'，use的範圍相對廣泛
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
