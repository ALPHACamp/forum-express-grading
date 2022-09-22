const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/categories-controller')
const upload = require('../../middleware/multer')// 將預計檔案存放位置相關設定載進來

// 閱覽一筆 category
router.get('/categories/:id', categoryController.getCategories)

// 瀏覽所有 categories
router.get('/categories', categoryController.getCategories)

// 新增一筆 category
router.post('/categories', categoryController.postCategories)

// 更新一筆 category
router.put('/categories/:id', categoryController.putCategory)

// 刪除一筆 category
router.delete('/categories/:id', categoryController.deleteCategory)

// 修改 Users 權限
router.patch('/users/:id', adminController.patchUser)

// 取得所有 Users
router.get('/users', adminController.getUsers)

router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/restaurants/:id/edit', adminController.editRestaurant)

router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

router.get('/restaurants/create', adminController.createRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)

router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.get('/restaurants', adminController.getRestaurants)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
