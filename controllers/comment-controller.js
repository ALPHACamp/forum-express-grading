const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id

      if (!text) throw new Error('Comment text is required!')

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId, { raw: true }),
        Restaurant.findByPk(restaurantId)
      ])
      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("User didn't exist!")

      // Increment restaurant comment counts
      await restaurant.increment('commentCounts')
      await Comment.create({
        text,
        restaurantId: restaurant.toJSON().id,
        userId
      })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      next(error)
    }
  },

  deleteComment: async (req, res, next) => {
    try {
      const isAdmin = await User.findByPk(req.user.id, { raw: true })
      if (!isAdmin) throw new Error("User doesn't exist!")

      const comment = await Comment.findByPk(req.params.id)
      if (!comment) throw new Error("Comment didn't exist!")
      comment.destroy()

      // Decrement restaurant comment counts
      const restInstance = await Restaurant.findByPk(comment.restaurantId)
      restInstance.decrement('commentCounts')

      return res.redirect(`/restaurants/${comment.restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = commentController
