const db = require('../models')
const Comment = db.Comment

const commentController = { 
  postComment: (req, res) => {
    const { text, restaurantId } = req.body
    const userId = req.user.id
    Comment.create({ 
      text, 
      RestaurantId: restaurantId, 
      UserId: userId
    })
      .then((comment) => { res.redirect(`/restaurants/${restaurantId}`) })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then((comment) => {
         comment.destroy()
          .then((comment) => {res.redirect(`/restaurants/${comment.RestaurantId}`)})
      })
  }
}
module.exports = commentController