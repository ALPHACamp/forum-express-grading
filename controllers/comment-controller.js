const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id
      if (!text) throw new Error('Comment text is required!')
      const [restaurant, user] = await Promise.all([
        Restaurant.findByPk(restaurantId),
        User.findByPk(userId)
      ])
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      if (!user) throw new Error("User didn't exist!")
      await Comment.create({
        text,
        userId,
        restaurantId
      })
      res.redirect(`/restaurants/${restaurantId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = commentController
