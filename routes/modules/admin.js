const express = require('express')
const router = express.Router()
// 載入 controller
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer') // 載入 multer

// 新增後台網址路由//匹配條件多的路由要寫在前面
router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.use('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
