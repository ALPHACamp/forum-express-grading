const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser } = require('../../middleware/auth')
const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')

router.get('/top', authenticated, userController.getTopUsers)
router.get('/:id/edit', authenticatedUser, userController.editUser)
router.put('/:id', authenticatedUser, upload.single('image'), userController.putUser)
router.get('/:id', authenticatedUser, userController.getUser)

module.exports = router
