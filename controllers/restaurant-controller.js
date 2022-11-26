const { Restaurant, Category } = require('../models')

const restaurantController = {
  // 瀏覽：全部餐廳
  getRestaurants: (req, res, next) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
        }))
        return res.render('restaurants', {
          restaurants: data
        })
      })
  },
  // 瀏覽：個別餐廳
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id)
  }
}

module.exports = restaurantController
