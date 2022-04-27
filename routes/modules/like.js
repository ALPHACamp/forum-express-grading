const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
//
router.post('/:restaurantId', userController.addLike)
router.delete('/:restaurantId', userController.removeLike)
//
module.exports = router
