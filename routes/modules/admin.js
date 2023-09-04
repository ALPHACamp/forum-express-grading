const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant) // 新增這行
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 新增這一行
router.get('/restaurants/:id', adminController.getRestaurant) // 新增這一行
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 新增這一行; 新增上傳圖片功能
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants) // 修改這行，新增 authenticatedAdmin 參數
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 新增這行; 新增上傳圖片功能

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
