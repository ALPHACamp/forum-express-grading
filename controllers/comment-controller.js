const { Comment, User, Restaurant } = require('../models')
const commentController = {
  postComment: async (req, res, next) => {
    const { userId } = req.user.id
    const { restaurantId, text } = req.body
    if (!text) throw new Error('Comment text is required!')
    try {
      const user = User.findByPk(userId)
      if (!user) throw new Error("User didn't exist!")
      const restaurant = Restaurant.findByPk(restaurantId)
      if (!restaurant) throw new Error("Restautant didn't exist!")
      Comment.create({ text, restaurantId, userId })
      return res.redirect(`/restaurant/${restaurantId}`)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = commentController
