const express = require('express')
const router = express.Router()

const restaurantController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin') // 新增這行，載入 admin.js
router.use('/admin', admin) // 新增這行
router.get('/', (req, res) => res.redirect('/restaurant'))

router.get('/restaurant', restaurantController.getRestaurants)

module.exports = router
