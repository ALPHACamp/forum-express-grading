const express = require('express')
const upload = require('../../middleware/multer')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// create
router.get('/restaurants/create', adminController.createRestaurant)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// read all
router.get('/restaurants', adminController.getRestaurants)

// detail
router.get('/restaurants/:id', adminController.getRestaurant)

// edit
router.get('/restaurants/:id/edit', adminController.editRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)

// delete
router.delete('/restaurants/:id', adminController.deleteRestaurant)

// user admin setting
router.get('/users', adminController.getUsers)
router.patch('/users/:id', adminController.patchUser)

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
