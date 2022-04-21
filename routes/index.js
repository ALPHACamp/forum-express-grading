const express = require('express')
const router = express.Router()

// 載入 controller
const restController = require('../controllers/restaurant-controller')
const userController = require('../controllers/user-controller')

const admin = require('./modules/admin')
// 條件較多的 route 盡量往前面

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
