const express = require('express')
const router = express.Router()
// 新增，載入 controller
const restController = require('../controllers/restaurant-controller')
// 載入 admin.js
const admin = require('./modules/admin')

router.use('/admin', admin)

router.get('/', (req, res) => {
  res.send('Hello World!')
})

// 新增

router.get('/restaurants', restController.getRestaurants)

router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
