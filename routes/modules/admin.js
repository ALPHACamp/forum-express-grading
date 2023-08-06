const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

const upload = require('../../middleware/multer')

// 導向後臺新增頁功能 - 取得新增餐廳的表單
router.get('/restaurants/create', adminController.createRestaurant)
// 導向後臺修改頁功能
router.get('/restaurants/:id/edit', adminController.editRestaurant)
// 導向後臺詳細頁功能 - 順序重要!!!
router.get('/restaurants/:id', adminController.getRestaurant)
// 提交 修改表單
router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
)
// 刪除資料
router.delete('/restaurants/:id', adminController.deleteRestaurant)
// 導向後臺首頁功能 - 瀏覽所有餐廳
router.get('/restaurants', adminController.getRestaurants)
// 新增一筆餐廳
router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
)
// 其餘重新導回 /restaurants
router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
