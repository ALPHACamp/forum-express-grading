const { User, Restaurant, Comment } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id

      if (!text) throw new Error('Comment text is required!')

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId, { raw: true }),
        Restaurant.findByPk(restaurantId, { raw: true })
      ])
      if (!user) throw new Error("User didn't exist!")
      if (!restaurant) throw new Error("User didn't exist!")

      await Comment.create({
        text,
        restaurantId,
        userId
      })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      next(error)
    }
  },

  deleteComment: (req, res, next) => {

  }
}

module.exports = commentController
