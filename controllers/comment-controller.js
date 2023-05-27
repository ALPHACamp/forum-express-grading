const { Comment, User, Restaurant } = require('../models') // 帶入資料庫

const commentController = {
  postComment: (req, res, next) => {
    const { restaurantId, text } = req.body // 抓form資料
    const userId = req.user.id // 抓userId
    if (!text) throw new Error('Comment text is required!')
    return Promise.all([ // 抓對應資料
      User.findByPk(userId),
      Restaurant.findByPk(restaurantId)
    ])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
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
  // 管理員刪除功能
  deleteComment: (req, res, next) => {
    return Comment.findByPk(req.params.id)
      .then(comment => {
        if (!comment) throw new Error("Comment didn't exist!")
        return comment.destroy()
      })
      .then(deletedComment => res.redirect(`/restaurants/${deletedComment.restaurantId}`)) // 轉址至被刪評論餐廳的頁面
      .catch(err => next(err))
  }
}
module.exports = commentController
