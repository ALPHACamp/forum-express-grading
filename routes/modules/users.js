const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const userController = require('../../controllers/user-controller')

//* 瀏覽編輯頁面
router.get('/top', userController.getTopUsers)
router.get('/:id/edit', userController.editUser)
router.put('/:id', upload.single('image'), userController.putUser)
//* 瀏覽個人頁面
router.get('/:id', userController.getUser)

module.exports = router
