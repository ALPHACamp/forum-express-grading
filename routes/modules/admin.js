const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer') // 載入 multer
const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', adminController.createRestaurant) // 刪除 authenticatedAdmin
router.get('/restaurants/:id/edit', upload.single('image'), adminController.editRestaurant)
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// router.patch('/users/:id', adminController.patchUser)
// router.get('/users', adminController.getUsers)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))
module.exports = router
