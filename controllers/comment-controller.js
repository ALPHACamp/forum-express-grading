const { Restaurant, User, Comment } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('評論不可空白')
    Promise.all([ // 先確認餐廳跟使用者是否都存在
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ]).then(([restaurant, user]) => {
      if (!restaurant) throw new Error('餐廳不存在')
      if (!user) throw new Error('使用者不存在')

      return Comment.create({ text, restaurantId, userId })
    })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  }
}

module.exports = commentController
