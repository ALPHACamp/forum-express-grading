const { Restaurant, User, Comment } = require('../models')
const commentController = {
  postComment: async (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    try {
      const [restaurant, user] = await Promise.all([
        Restaurant.findByPk(restaurantId, { raw: true }),
        User.findByPk(userId, { raw: true })
      ])
      if (!restaurant) throw new Error('不存在的餐廳!')
      if (!user) throw new Error('不存在的使用者!')
      await Comment.create({
        text,
        userId,
        restaurantId
      })
      req.flash('success_msg', '新增評論成功!')
      return res.redirect(`/restaurants/${restaurantId}`)
    } catch (error) {
      return next(error)
    }
  }
}

module.exports = commentController
