const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')

const adminController = require('../../controllers/admin-controller')

// 新增餐廳
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// 顯示單一餐廳
router.get('/restaurants/:id', adminController.getRestaurant)

// 編輯單一餐廳
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

// 刪除單一餐聽
router.delete('/restaurants/:id', adminController.deleteRestaurant)

// 顯示所有餐廳
router.get('/restaurants', adminController.getRestaurants)

// 顯示所有使用者
router.get('/users', adminController.getUsers)

// 更新使用者權限
router.patch('/users/:id', adminController.patchUser)

// 首頁路由
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
