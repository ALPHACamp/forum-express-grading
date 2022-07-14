const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id
      if (!text) throw new Error('Comment text is required!')

      const [user, restaurant] = await Promise.all([User.findByPk(userId), Restaurant.findByPk(restaurantId)])
      if (!user) throw new Error('This user does not exist!')
      if (!restaurant) throw new Error('This restaurant does not exist!')

      await Comment.create({ text, restaurantId, userId })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      next(error)
    }
  },
}

module.exports = commentController
