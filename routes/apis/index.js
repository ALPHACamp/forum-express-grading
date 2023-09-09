const express = require('express')
const router = express.Router()
const admin = require('./modules/admin') // 新增這裡
const restController = require('../../controllers/apis/restaurant-controller')
router.use('/admin', admin) // 新增這裡
router.get('/restaurants', restController.getRestaurants)
module.exports = router