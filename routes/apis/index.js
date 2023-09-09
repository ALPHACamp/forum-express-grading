const express = require('express')
const router = express.Router()
const admin = require('./modules/admin') // 新增這裡
const restController = require('../../controllers/apis/restaurant-controller')
const { apiErrorHandler } = require('../../middleware/error-handler') // 新增這行
router.use('/admin', admin) // 新增這裡
router.get('/restaurants', restController.getRestaurants)
router.use('/', apiErrorHandler) // 新增這行
module.exports = router