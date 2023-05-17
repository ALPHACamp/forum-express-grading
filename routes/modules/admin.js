const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const adminController = require('../../controllers/admin-controller')

// 管理者新增頁面
router.get('/restaurants/create', adminController.createRestaurant)

// 管理者編輯資料頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant)

// 管理者瀏覽餐廳詳細資料
router.get('/restaurants/:id', adminController.getRestaurant)

// 管理者編輯餐廳資料
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

// 管理者刪除餐廳資料
router.delete('/restaurants/:id', adminController.deleteRestaurant)

// 管理者登入首頁
router.get('/restaurants', adminController.getRestaurants)

// 管理者新增功能
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// 管理者變更使用者權限
router.patch('/users/:id', adminController.patchUser)

// 使用者首頁
router.get('/users', adminController.getUsers)

// 自動導向管理者首頁
router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
