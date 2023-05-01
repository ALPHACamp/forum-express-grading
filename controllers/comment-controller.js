const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    // 檢查留言是否為空
    if (!text) throw new Error('Comment text is required!')
    Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        return Comment.create({
          restaurantId,
          userId,
          text
        })
      })
      .then(() => {
        req.flash('success_messages', 'Comment is created!')
        res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
