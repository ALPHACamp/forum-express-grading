const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const upload = require('../../middleware/multer')
const userController = require('../../controllers/user-controller')

router.get('/top', authenticated, userController.getTopUsers)
router.get('/:id/edit', userController.editUser)
router.put('/:id', upload.single('image'), userController.putUser)
router.get('/:id', userController.getUser)

module.exports = router
