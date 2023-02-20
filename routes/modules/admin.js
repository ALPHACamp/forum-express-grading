const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/:id/edit', adminController.editRestaurant)// 改
router.put('/restaurants/:id/', adminController.putRestaurant)// 改
router.get('/restaurants/:id', adminController.getRestaurant)// 查

router.get('/restaurants/create', adminController.createRestaurant)// 增
router.post('/restaurants', adminController.postRestaurant)// 增

router.get('/restaurants', adminController.getRestaurants) // 查

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
