const express = require('express')
const router = express.Router()

// middleware
const upload = require('../../middleware/multer') // 載入multer的圖片上傳

// Controllers
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

// 後台餐廳CRUD
router.get('/restaurants/create', adminController.createRestaurantPage)
router.get('/restaurants/:id/edit', adminController.editRestaurantPage)
router.get('/restaurants/:id', adminController.getRestaurantDetail) // 放create上面，/create 會被認為是 會先被解讀成 :id，但這個 id 值並不存在，所以出現錯誤訊息
router.put('/restaurants/:id', upload.single('image'), adminController.updateRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
// 顯示User & 身份權限
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)
// 後台分類CRUD
router.get('/categories/:id', categoryController.getCategories)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)
router.put('/categories/:id', categoryController.putCategory)
router.delete('/categories/:id', categoryController.deleteCategory)

// fallback 路由，其他路由條件都不符合時，最終會通過此路由
router.use('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
