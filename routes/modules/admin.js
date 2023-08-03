const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')

// 新增一筆資料頁面
router.get('/restaurants/create', adminController.createRestaurant)
// 編輯一筆資料頁面
router.get('/restaurants/:id/edit', adminController.editRestaurant)
// 編輯送出
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
// 瀏覽一筆資料頁面
router.get('/restaurants/:id', adminController.getRestaurant)
// 刪除一筆資料
router.delete('/restaurants/:id', adminController.deleteRestaurant)
// 新增送出
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
// 瀏覽全部資料頁面
router.get('/restaurants', adminController.getRestaurants)

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)
router.get('/categories', categoryController.getCategories)
router.post('/categories', categoryController.postCategory)


// 注意這邊在教案中是router.use('',(req, res)...)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
