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
  }
}
module.exports = commentController