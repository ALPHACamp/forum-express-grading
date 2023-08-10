const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
const categoryController = require('../../controllers/category-controller')
const upload = require('../../middleware/multer')

router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) //! upload.single('image')：接收表單中 name='image' 的一個檔案，並將檔案資訊存在 req.file 中
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.get('/categories', categoryController.getCategories)

router.get('/restaurants', adminController.getRestaurants)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
