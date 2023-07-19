const express = require('express')
const router = express.Router()
const admin = require('./modules/admin')
// 用：可以重新命名
const { restaurantController: restController } = require('../controllers/restaurant-controller')
const { userController } = require('../controllers/user-controller')

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.use('/admin', admin)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
