const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

router.patch('/users/:id', adminController.patchUser) // 使用者權限管理
router.get('/users', adminController.getUsers) // 後台使用者管理路由
router.get('/categories/:id', categoryController.getCategories) // 單一分類路由
router.put('/categories/:id', categoryController.putCategory) // 編輯分類路由
router.get('/categories', categoryController.getCategories) // 後台分類管理路由
router.post('/categories', categoryController.postCategory) // 後台分類新增路由
router.get('/restaurants/create', adminController.createRestaurant) // 新增路由
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 編輯路由
router.get('/restaurants/:id', adminController.getRestaurant) // 瀏覽單筆資料路由
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 送出編輯表單
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 刪除路由
router.get('/restaurants', adminController.getRestaurants) // 導入登入狀態驗證
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 提交新增路由

router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
