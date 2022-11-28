const express = require('express')
const router = express.Router()
// 載入 controller
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer') // 載入 multer

router.get('/restaurants/create', adminController.createRestaurant) // 新增餐廳表單頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 編輯餐廳表單頁面
router.get('/restaurants/:id', adminController.getRestaurant) // 瀏覽1間餐廳
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 編輯餐廳
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 刪除餐廳
router.get('/restaurants', adminController.getRestaurants) // 瀏覽全部餐廳
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 新增餐廳

router.patch('/users/:id', adminController.patchUser) // 修改User的權限
router.get('/users', adminController.getUsers) // 瀏覽全部User

router.get('/categories/:id', categoryController.getCategories) // 編輯category頁面
router.put('/categories/:id', categoryController.putCategory) // 編輯category
router.delete('/categories/:id', categoryController.deleteCategory) // 刪除category
router.get('/categories', categoryController.getCategories) // 瀏覽categories頁面
router.post('/categories', categoryController.postCategory) // 新增category

// 設定 fallback 路由(其他路由條件都不符合時，最終會通過的路由)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
