const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')
const categoryController = require('../../controllers/category-controller')

router.get('/restaurants/create', adminController.createRestaurant)// 新增餐廳頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant)// 編輯餐廳頁面
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 修改餐廳
router.get('/restaurants/:id', adminController.getRestaurant)// 瀏覽單一餐廳
router.delete('/restaurants/:id', adminController.deleteRestaurant)// 刪除餐廳
router.get('/restaurants', adminController.getRestaurants)// 瀏覽全部餐廳
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // 新增餐廳

router.patch('/users/:id', adminController.patchUser)// 更改使用者權限
router.get('/users', adminController.getUsers)// 瀏覽全部使用者

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.post('/categories', categoryController.postCategory) // 新增類別
router.get('/categories', categoryController.getCategories)// 瀏覽全部類別

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
