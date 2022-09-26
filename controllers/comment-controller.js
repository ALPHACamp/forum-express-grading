const { Comment, User, Restaurant } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('評論內容是必填的')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error('查無使用者資料，請重新嘗試')
        if (!restaurant) throw new Error('查無餐廳資料，請重新嘗試')
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error('查無此留言資訊')

        return comment.destroy()
      })
      .then(deleteComment => res.redirect(`/restaurants/${deleteComment.restaurantId}`))
      .catch(err => next(err))
  }
}

module.exports = commentController
