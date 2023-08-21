const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: Category
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({ // 小括號代替return
          ...r,
          description: r.description.substring(0, 50) // 雖然展開的時候也有屬性了，但後面的keyvalue可以覆蓋前面的keyvalue
        })
        )
        return res.render('restaurants', { restaurants: data })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
