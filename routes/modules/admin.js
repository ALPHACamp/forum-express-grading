const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
// const { authenticatedAdmin } = require('../../middleware/auth') // 引入 auth.js
router.get('/restaurants/create', adminController.createRestaurant) // 把 authenticatedAdmin 參數拿出去到index內，由index頁傳入
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant) // 因為_method=PUT，所以用put
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', adminController.postRestaurant)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
