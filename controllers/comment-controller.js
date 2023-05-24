const { Comment, User, Restaurant } = require('../models')

const commentController = {
    postComment: (req, res, next) => {
        const { restaurantId, text } = req.body // restaurantId, text 取自於HTML的name屬性
        const userId = req.user.id // 登入者身份 UserId

        if (!text) throw new Error('Comment text is required!')

        Promise.all([
            User.findByPk(userId), // 查詢是否有使用者
            Restaurant.findByPk(restaurantId)
        ])
            .then(([user, restaurant]) => {
                if (!user) throw new Error("User didn't exist!")
                if (!restaurant) throw new Error("Restaurant didn't exist!")
                return Comment.create({ text, restaurantId, userId })
            })
            .then(() => {
                res.redirect(`/restaurants/${restaurantId}`)
            })
            .catch(err => next(err))
    }
}
module.exports = commentController
