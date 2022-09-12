const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
const userController = require('../controllers/user-controller')
const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
// 若接收到的請求路徑=restaurants則交由controller處理
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))
router.use('/', generalErrorHandler)
module.exports = router
