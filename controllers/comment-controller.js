const { Restaurant, Comment, User } = require('../models')
const authHelpers = require('../helpers/auth-helpers')

const commentController = {
  // handling how a user create a comment about a restaurant
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = authHelpers.getUserId(req)

    if (!text) throw new Error('Comment text is required!')
    // ensure that both restaurant and user exist
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        // either restaurant or user doesn't exist
        if (!restaurant) throw new Error('Restaurant didn\'t exist!')
        if (!user) throw new Error('User did\'n exist')
        // both restaurant and user exist
        return Promise.all([
          Comment.findOne({ where: { userId, restaurantId } }),
          restaurant,
          user
        ])
      })
      .then(([comment, restaurant, user]) => {
        return Promise.all([
          (!comment) ? user.increment('restCommentCount') : null,
          restaurant.increment('commentedCount')
        ])
      })
      .then(() => {
        return Comment.create({
          text,
          userId,
          restaurantId
        })
      })
      .then(() => res.redirect(`/restaurants/${restaurantId}`))
      .catch(error => next(error))
  },
  deleteComment: (req, res, next) => {
    // handling how a user delete a comment about a restaurant
    const id = req.params.id
    Comment.findByPk(id)
      .then(comment => {
        if (!comment) throw new Error('Comment didn\'t exist')
        return comment.destroy()
      })
      .then(deletedComment => {
        // continue to find the same record for counting number of all type comment
        return Promise.all([
          Comment.findOne({
            where: {
              userId: deletedComment.userId,
              restaurantId: deletedComment.restaurantId
            }
          }),
          Restaurant.findByPk(deletedComment.restaurantId),
          User.findByPk(deletedComment.userId)
        ])
      })
      .then(([comment, restaurant, user]) => {
        // decrement comment count for each restaurant and each user
        return Promise.all([
          restaurant.decrement('commentedCount'),
          (!comment) ? user.decrement('restCommentCount') : null
        ])
      })
      .then(([restaurant, _]) => {
        req.flash('success_messages', '成功移除留言')
        res.redirect(`/restaurants/${restaurant.id}`)
      })
      .catch(error => next(error))
  }
}

exports = module.exports = commentController
