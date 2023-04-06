const express = require('express')
const router = express.Router()

const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')
router.use('/admin', admin)
// 注意路由擺放順序，匹配條件多的寫在前面
router.get('/restaurants', restController.getRestaurants)
// fallback 路由，若req都沒有匹配到，最後就會進入這
router.use('/', (req, res) => {
  res.redirect('/restaurants')
})

module.exports = router
