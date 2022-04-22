const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: async (req, res, next) => {
    try {
      const { text, restaurantId } = req.body
      const userId = req.user.id
      if (!text) throw new Error('評論為必填！')

      const [user, restaurant] = await Promise.all([
        User.findByPk(userId),
        Restaurant.findByPk(restaurantId)
      ])

      if (!user) throw new Error('使用者不存在！')
      if (!restaurant) throw new Error('該餐廳不存在！')

      await Comment.create({
        text,
        restaurantId,
        userId
      })

      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = commentController
