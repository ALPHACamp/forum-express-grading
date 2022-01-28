// 引入模組
const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

// 設定/admin路由
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:rest_id/edit', adminController.editRestaurant)
router.get('/restaurants/:rest_id', adminController.getRestaurant)
router.put('/restaurants/:rest_id', upload.single('image'), adminController.putRestaurant)
router.patch('/users/:id', adminController.patchUser)
router.delete('/restaurants/:rest_id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/users', adminController.getUsers)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

// 匯出模組
module.exports = router
