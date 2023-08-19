const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

const upload = require('../../middleware/multer') // 需要上傳的路由掛載

/*  使用者餐廳部分 */
router.get('/restaurants/create', adminController.createRestaurants)
router.get('/restaurants/:id/edit', adminController.editRestaurant)

// id的路由要後於Create， 否則先有id變動的判斷，create會被識別為變動的id
router.get('/restaurants/:id', adminController.getRestaurant)
router.put('/restaurants/:id', upload.single('image'), adminController.putRestaurant)
router.delete('/restaurants/:id', adminController.deleteRestaurant)
router.get('/restaurants', adminController.getRestaurants)
router.post('/restaurants', upload.single('image'), adminController.postRestaurant) // upload中間件捕捉file 轉換req.file傳給路由並將檔案存入temp資料夾

/*  使用者管理部分 */
router.get('/users', adminController.getUsers)

router.use('/', (req, res) => { res.redirect('/admin/restaurants') })
module.exports = router
