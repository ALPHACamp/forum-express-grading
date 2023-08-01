const express = require('express')
const router = express.Router()

// 新增，載入 controller
const resrController = require('../controllers/restaurant-controller')

router.get('/restaurant', resrController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurant'))

module.exports = router
