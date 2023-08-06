const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
// const { authenticatedAdmin } = require('../../middleware/auth') // 有建立在 index 了
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
