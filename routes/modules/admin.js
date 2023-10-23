const express = require('express')
const upload = require('../../middleware/multer')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')
// 用來驗證身分是否為管理者

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
