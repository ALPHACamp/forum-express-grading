const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // 新增這行
router.get('/restaurants/:id', adminController.getRestaurant) // 新增這一行
router.get('/restaurants', adminController.getRestaurants) // 修改這行，新增 authenticatedAdmin 參數
router.post('/restaurants', adminController.postRestaurant) // 新增這行

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
