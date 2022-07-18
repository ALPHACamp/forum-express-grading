const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const upload = require('../../middleware/multer')
const { authenticatedUser } = require('../../middleware/auth')

router.get('/:id/edit', authenticatedUser, userController.editUser)
router.put('/:id', authenticatedUser, upload.single('image'), userController.putUser)
router.get('/:id', userController.getUser)

module.exports = router