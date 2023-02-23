const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

router.patch('/users/:id', adminController.patchUser)
router.get('/users', adminController.getUsers)

router.get('/restaurants/create', adminController.createRestaurant)// 增
router.get('/restaurants/:id/edit', adminController.editRestaurant)// 改
router.delete('/restaurants/:id', adminController.deleteRestaurant)// 刪
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)// 改
router.get('/restaurants/:id', adminController.getRestaurant)// 查
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)// 增
router.get('/restaurants', adminController.getRestaurants) // 查

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
