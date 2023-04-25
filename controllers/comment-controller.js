const { Restaurant, User, Comment } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { text, restaurantId } = req.body
      const userId = req.user.id
      if (!text) throw new Error('Comment text is required!')
      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])
      if (!user || !restaurant) throw new Error("User or Restaurant didn't exist!")
      await Comment.create({ text, userId, restaurantId })
      res.redirect(`/restaurants/${restaurantId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = commentController