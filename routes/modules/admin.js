const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')
//* 新增餐廳
router.get('/restaurants/create', adminController.createRestaurant)
router.post(
  '/restaurants',
  upload.single('image'),
  adminController.postRestaurant
)

//* 餐廳詳細
router.get('/restaurants/:id', adminController.getRestaurant)
//* 編輯餐廳資料
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put(
  '/restaurants/:id',
  upload.single('image'),
  adminController.putRestaurant
)

//* 刪除餐廳
router.delete('/restaurants/:id', adminController.deleteRestaurant)
//* 所有帳號頁面
router.get('/users', adminController.getUsers)
//* 修改使用者權限
router.patch('/users/:id', adminController.patchUser)

//* 瀏覽全部餐廳
router.get('/restaurants', adminController.getRestaurants)

//* 瀏覽全部分類
router.get('/categories', categoryController.getCategories)
//* 新增分類
router.post('/categories', categoryController.postCategory)

//* 編輯分類
router.get('/categories/:id', categoryController.getCategories)
router.put('/categories/:id', categoryController.putCategory)

//*刪除分類
router.delete('/categories/:id', categoryController.deleteCategory)

router.use('', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
