const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller.js')

const upload = require('../../middleware/multer.js')

router.get('/:id/edit', userController.editUser)

router.put('/:id', upload.single('image'), userController.putUser)

router.get('/:id', userController.getUser)

module.exports = router