const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
// 用來驗證身分是否為管理者

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
