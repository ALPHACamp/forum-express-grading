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
  },
  deleteComment: (req, res, next) => {
    Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")
        return comment.destroy()
      })
      .then(deleteComment => {
        console.log(deleteComment)
        res.redirect(`/restaurants/${deleteComment.restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
