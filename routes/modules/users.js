const express = require('express')
const router = express.Router()

const { authenticatedUser } = require('../../middleware/auth')

const userController = require('../../controllers/user-controller')

const upload = require('../../middleware/multer')

router.get('/:id/edit', authenticatedUser, userController.editUser)
router.put(
  '/:id',
  authenticatedUser,
  upload.single('image'),
  userController.putUser
)
router.get('/:id', userController.getUser)

module.exports = router
