const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const restaurantId = req.body.restaurantId
      const text = req.body.text.trim()
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

      await user.increment('commentCounts', { by: 1 })
      req.flash('success_messages', 'postComment successfully')

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      next(error)
    }
  },
  deleteComment: async (req, res, next) => {
    try {
      const comment = await Comment.findByPk(req.params.comment_id,
        {
          include: [User],
          nest: true
        }
      )
      if (!comment) throw new Error("Comment didn't exist!'")
      const deletedComment = await comment.destroy()

      await comment.User.decrement('commentCounts', { by: 1 })
      req.flash('error_messages', 'deleteComment successfully')

      return res.redirect(`/restaurants/${deletedComment.restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = commentController
