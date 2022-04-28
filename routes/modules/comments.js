const express = require('express')
const router = express.Router()
const { authenticated, authenticatedAdmin } = require('../../middleware/auth')
const commentController = require('../../controllers/comment-controller')
//
router.delete('/:id', authenticatedAdmin, commentController.deleteComment)
router.post('/', authenticated, commentController.postComment)
//
module.exports = router
