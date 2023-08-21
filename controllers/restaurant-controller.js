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
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(async restaurant => {
        if (!restaurant) throw new Error('此餐廳不存在')
        await restaurant.increment('viewCounts')
        const data = restaurant.toJSON()
        console.log('data is : ', data)
        return res.render('restaurant', { restaurant: data })
      })
      .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
