const { Restaurant, User, Comment } = require('../models')

const commentController = {
  postComment: (req, res, next) => {
    const { text, restaurantId } = req.body // 從 req.body 拿出表單裡的資料
    const userId = req.user.id
    if (!text || (text.replace(/ /g, '') === '')) throw new Error('Comment text is required!')

    return Promise.all([User.findByPk(userId), Restaurant.findByPk(restaurantId)])
      .then(([user, restaurant]) => {
        if (!user) throw new Error("(User didn't exist!")
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        return Comment.create({
          text,
          userId,
          restaurantId
        })
      })
      .then(() => {
        res.redirect(`/restaurants/${restaurantId}`)
      })
      .catch(err => next(err))
  }
}

module.exports = commentController
