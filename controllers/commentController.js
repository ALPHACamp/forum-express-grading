const db = require('../models')
const Comment = db.Comment
const helpers = require('../_helpers')

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId } = req.body

    return Comment.create({
      text, RestaurantId: restaurantId, UserId: helpers.getUser(req).id
    })
      .then(comment => {
        return res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => console.log(err))
  },

  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        comment.destroy()
          .then(comment => {
            return res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }
}

module.exports = commentController