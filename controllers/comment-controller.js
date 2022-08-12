const { Comment, User, Restaurant } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body
    const userId = req.user.id
    if (!text) throw new Error('Comment text is require!')
    return Promise.all([
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("restaurant didn't exist!")
        restaurant.increment('commentCounts')
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
      .then(() => {
        res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  },
  deleteComment: (req, res, next) => {
    const { restaurantId } = req.body

    return Promise.all([
      Comment.findByPk(req.params.id),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([comment, restaurant]) => {
        if (!comment) throw new Error("Comment didn't exist!'")
        if (!restaurant) throw new Error("Restaurant didn't exist")
        restaurant.decrement('commentCounts')
        return comment.destroy()
      })
      .then(deletedComment => res.redirect(`/restaurants/${deletedComment.restaurantId}`))
      .catch(err => next(err))
  }
}
module.exports = commentController
