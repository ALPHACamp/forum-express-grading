const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: async (req, res, next) => {
    const resData = await Restaurant.findAll({
      include: Category,
      nest: true,
      raw: true
    })
    const restaurants = resData.map(res => ({
      ...res,
      description: res.description.substring(0, 50)
    }))
    res.render('restaurants', { restaurants })
  }
}

module.exports = restaurantController
