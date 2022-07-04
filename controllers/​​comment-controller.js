const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { restaurantId, text } = req.body
      const userId = req.user.id

      if (!text) throw new Error('Comment text is required!')

      const user = await User.findByPk(userId)
      const restaurant = await Restaurant.findByPk(restaurantId)

      if (!user) throw new Error('使用者不存在')
      if (!restaurant) throw new Error('餐廳不存在')

      await restaurant.increment('commentCounts')
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
  deleteComment: async (req, res, next) => {
    try {
      const { restaurantId } = req.body
      const comment = await Comment.findByPk(req.params.id)
      const restaurant = await Restaurant.findByPk(restaurantId)

      if (!comment) throw new Error("Comment didn't exist!")
      if (!restaurant) throw new Error("Restaurant didn't exist!")

      await restaurant.decrement('commentCounts')
      await comment.destroy()
      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      next(error)
    }
  }
}
module.exports = commentController
