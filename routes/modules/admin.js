const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer') // 載入 multer

router.get('/restaurants/create', adminController.createRestaurants) // 新增這行
router.get('/restaurants/:id/edit', adminController.editRestaurant) // 新增這一行
router.get('/restaurants/:id', adminController.getRestaurant) // 新增這一行
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant) // 新增這一行
router.delete('/restaurants/:id', adminController.deleteRestaurant) // 新增這一行
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurants) // 新增這行

router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router

// const express = require('express')
// const router = express.Router()
// const adminController = require('../../controllers/admin-controller')
// router.get('/restaurants', adminController.getRestaurants)
// router.use('/', (req, res) => res.redirect('/admin/restaurants'))
// module.exports = router
