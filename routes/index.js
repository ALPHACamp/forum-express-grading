const express = require('express')

const router = express.Router()
const passport = require('../config/passport')

//* 載入middleware
const { authenticated, authenticatedAdmin } = require('../middleware/auth')
//* 載入子路由
const admin = require('./modules/admin')

//* 載入controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')
//* 後台
router.use('/admin', authenticatedAdmin, admin)

//* 使用者
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
//* 瀏覽全部餐廳
router.get('/restaurants', authenticated, restController.getRestaurants)
//* 瀏覽單一餐廳
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
//* 瀏覽單一餐廳數據
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashboard
)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)

module.exports = router
