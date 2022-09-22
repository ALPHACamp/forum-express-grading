const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticatedUser } = require('./../../middleware/auth')
const upload = require('../../middleware/multer')

router.get('/top', userController.getTopUsers)
router.get('/:userId/edit', authenticatedUser, userController.editUser)
router.get('/:userId', userController.getUser)
router.put('/:userId', authenticatedUser, upload.single('image'), userController.putUser)

module.exports = router
