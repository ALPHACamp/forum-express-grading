const express = require('express')
const upload = require('../../middleware/multer')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id', userController.getUser)
router.get('/:id/edit', userController.editUser)
router.put('/:id', upload.single('avatar'), userController.putUser)

module.exports = router
