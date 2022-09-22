const { Comment, User, Restaurant } = require('../models')

const CommentController = {
  postComment: async (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    try {
      if (!text) throw new Error("Comment can't be empty.")
      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])
      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("Restaurnat didn't exist!")
      await Comment.create({ text, restaurantId, userId })
      res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      text(error)
    }
  },
  deleteComment: async (req, res, next) => {
    const { id } = req.params
    try {
      const comment = await Comment.findByPk(id)
      if (!comment) throw new Error("Commet didn't exist!")
      const deletedComment = await comment.destroy()
      res.redirect(`/restaurants/${deletedComment.restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CommentController
