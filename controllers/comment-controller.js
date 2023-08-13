const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id

      if (!text) throw new Error('Comment text is required!')

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])

      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      await Comment.create({
        text,
        restaurantId,
        userId
      })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      return next(error)
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.id)

      if (!comment) throw new Error("Comment didn't exist!'")

      const deletedComment = await comment.destroy()

      return res.redirect(`/restaurants/${deletedComment.restaurantId}`)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = commentController
