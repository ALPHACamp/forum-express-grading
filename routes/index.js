const express = require('express')
const router = express.Router()
// 後台
const admin = require('./modules/admin')
router.use('/admin', admin)

// 前台
const restaurantController = require('../controllers/restaurant-controller')
router.get('/restaurants', restaurantController.getRestaurants)
router.get('/', (req, res) => res.redirect('/restaurants')) // fallback

module.exports = router
