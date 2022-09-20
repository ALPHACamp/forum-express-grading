const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticatedUser } = require('./../../middleware/auth')

router.get('/:userId/edit', authenticatedUser, userController.editUser)
router.get('/:userId', userController.getUser)

module.exports = router
