const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

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

// 編輯分類頁
router.get('/categories/:id', categoryController.getCategories)

// 修改分類
router.put('/categories/:id', categoryController.putCategory)

// 刪除分類
router.delete('/categories/:id', categoryController.deleteCategory)

// 分類首頁
router.get('/categories', categoryController.getCategories)

// 新增分類
router.post('/categories', categoryController.postCategory)

// 使用者首頁
router.get('/users', adminController.getUsers)

// 自動導向管理者首頁
router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
