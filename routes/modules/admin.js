const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

// 顯示使用者清單
router.get('/users', adminController.getUsers)
// 修改使用者權限
router.patch('/users/:id', adminController.patchUser)

// 瀏覽所有分類
router.get('/categories', categoryController.getCategories)
// 瀏覽編輯分類的表單
router.post('/categories', categoryController.postCategory)

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
) // 修改後台編輯餐廳的路由

router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
) // 修改後台新增餐廳的路由

router.get('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
