const commentController = require('./../../controllers/comment-controller')
const { authenticatedAdmin } = require('./../../middleware/auth')
const express = require('express')
const router = express.Router()

router.post('/', commentController.postComment)
router.delete('/:commentId', authenticatedAdmin, commentController.deleteComment)

module.exports = router
