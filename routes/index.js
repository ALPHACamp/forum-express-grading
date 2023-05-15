const express = require('express')
const router = express.Router()
const restController = require('../controllers/restaurant-controller')
const admin = require('./modules/admin') // 新增這行，載入 admin.js

router.use('/admin', admin) // 新增這行
router.get('/restaurants', restController.getRestaurants)
router.use('/', (req, res) => res.redirect('/restaurants'))

module.exports = router
