const { Restautant, User, Comment } = require('../models')
const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    if (!text) throw new Error('comment text id required')
    return Promise.all([
      Restautant.findByPk(restaurantId),
      User.findByPk(userId)
    ])
      .then(([restaurant, user]) => {
        if (!restaurant) throw new Error("restaurant didn't exist")
        if (!user) throw new Error("user didn't exist")
        return Comment.create({
          text,
          restaurantId,
          userId
        })
      })
  }
}
module.exports = commentController
