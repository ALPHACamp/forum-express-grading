const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant)
// 進入編輯餐廳資訊入口
router.get('/restaurants/:id/edit', adminController.editRestaurant)
// 進入個別餐廳資訊頁面
router.get('/restaurants/:id', adminController.getRestaurant)
// 更新餐廳資訊
router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
// 餐廳List
router.get('/restaurants', adminController.getRestaurants)
// 建立餐廳資訊
router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
