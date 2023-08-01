const express = require('express')
const router = express.Router()

// 新增，載入 controller
const resrController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', resrController.getRestaurants)

router.get('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
