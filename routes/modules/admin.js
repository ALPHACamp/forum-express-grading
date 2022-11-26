const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const upload = require('../../middleware/multer')

// 新建admin餐廳頁面，注意順序
router.get('/restaurants/create', adminController.createRestaurant)
// 編輯檢視，位置要比較前面
router.get('/restaurants/:rest_id/edit', adminController.editRestaurant)
// 瀏覽餐廳詳細資料。路由字串裡的 :id 是在跟 Express 説這是一個會變動的欄位，請幫我匹配到這個網址，並且把 req.params.id 設成同樣的值，傳給 controller 用。
router.get('/restaurants/:rest_id', adminController.getRestaurant)
// 編輯餐廳送出
router.put('/restaurants/:rest_id', upload.single('image'), adminController.putRestaurant)
// delete
router.delete('/restaurants/:id', adminController.deleteRestaurant)
// 全部餐廳
router.get('/restaurants', adminController.getRestaurants)
// create 送出
router.post('/restaurants', upload.single('image'), adminController.postRestaurant)

// get users
router.get('/users', adminController.getUsers)
// patch users
// router.patch('/users/:id', adminController.patchUser)

// 這行是做甚麼的，我忘了
router.use('/', (req, res) => res.redirect('/admin/restaurants'))

module.exports = router
