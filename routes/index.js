const express = require('express')

const router = express.Router()

// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const admin = require('./modules/admin')

// 刪除
// router.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// 新增
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
router.get('/restaurants', restController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
