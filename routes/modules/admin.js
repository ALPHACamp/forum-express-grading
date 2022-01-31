const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants', adminController.getRestaurants)
router.get('/restaurants/create', adminController.createRestaurant)

router.get('/users', adminController.getUsers)

router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

router.delete('/restaurants/:id', adminController.deleteRestaurant)

router.get('/restaurants/:id', adminController.getRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/', (req, res) => res.redirect('/admin/restaurants'))

exports = module.exports = router
