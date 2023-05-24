const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const adminController = require('../../controllers/admin-controller')
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.patch('/users/:id', adminController.patchUser)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)// 把關是否為管理者
router.get('/users', adminController.getUsers)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.use('', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
