const express = require('express')
const router = express.Router()

const upload = require('../../middleware/multer')

const userController = require('../../controllers/user-controller')

router.get('/top', userController.getTopUsers)
// user
router.get('/:id', userController.getUser)
router.get('/:id/edit', userController.editUser)
router.put('/:id', upload.single('image'), userController.putUser)

module.exports = router
