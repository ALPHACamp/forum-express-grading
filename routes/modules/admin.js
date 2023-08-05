
const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // (頁面)新增餐廳
router.get('/restaurants/:id/edit', adminController.editRestaurant) // (頁面)修改餐廳
router.get('/restaurants/:id', adminController.getRestaurant) // (頁面)瀏覽單一餐廳詳細資料
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // (功能)修改餐廳資料
router.delete('/restaurants/:id', adminController.deleteRestaurant) // (功能)刪除餐廳

router.get('/restaurants', adminController.getRestaurants) // (頁面)餐廳管理清單

router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // (功能)新增餐廳

router.get('/users', adminController.getUsers) // (頁面)使用者管理清單
router.patch('/users/:id', adminController.patchUser) // (功能)更新使用者權限

// fallback路由，當其他條件都不符合，最終都會通過這一條
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
