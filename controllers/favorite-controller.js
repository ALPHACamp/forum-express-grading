const db = require('../models')
const { Restaurant, Favorite } = db

const favoriteController = {
  addFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: { restaurantId, userId }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) throw new Error('This restaurant is not existed!')
        if (favorite) throw new Error('This is already added to favorite!')
        return Favorite.create({ restaurantId, userId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFavorite: (req, res, next) => {
    const userId = req.user.id
    const { restaurantId } = req.params
    return Favorite.findOne({
      where: { restaurantId, userId }
    })
      .then(favorite => {
        if (!favorite) throw new Error("You haven't favorited this restaurant")
        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}

module.exports = favoriteController
