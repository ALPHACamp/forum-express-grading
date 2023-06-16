const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth') // 引入 auth.js

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 新增這一行

router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant)

router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
