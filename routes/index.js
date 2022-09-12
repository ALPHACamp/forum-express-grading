const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
// 若接收到的請求路徑=restaurants則交由controller處理
router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
