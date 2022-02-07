const { Restaurant, Comment, User } = require('../models')
const authHelpers = require('../helpers/auth-helpers')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = authHelpers.getUserId(req)
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error('Restaurant didn\'t exist!')
        if (!user) throw new Error('User did\'n exist')
        return restaurant.increment('commentCounts')
      })
      .then(() =>
        Comment.create({
          text,
          userId,
          restaurantId
        })
      )
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(error => next(error))
  },
  deleteComment: (req, res, next) => {
    const id = req.params.id
    Comment.findByPk(id)
      .then(comment => {
        if (!comment) throw new Error('Comment didn\'t exist')
        return comment.destroy()
      })
      .then(deletedComment => {
        return Restaurant.findByPk(deletedComment.restaurantId)
      })
      .then(restaurant => {
        return restaurant.update({
          commentCounts: --restaurant.commentCounts
        })
      })
      .then(restaurant => {
        req.flash('success_messages', '成功移除留言')
        res.redirect(`/restaurants/${restaurant.id}`)
      })
      .catch(error => next(error))
  }
}

exports = module.exports = commentController
