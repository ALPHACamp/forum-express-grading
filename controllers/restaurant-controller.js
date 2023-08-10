const { Restaurant, Category } = require('../models')

const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([
      Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category],
        where: {
          ...categoryId ? { categoryId } : {}
        }
      }),
      Category.findAll({ raw: true })
    ])
      .then(([restaurants, categories]) => {
        const data = restaurants.map(restaurant =>
          ({
            ...restaurant,
            description: restaurant.description.substring(0, 50)
          }))
        return res.render('restaurants', {
          restaurants: data,
          categories,
          categoryId
        })
      })
      .catch(error => next(error))
  },
  getRestaurant: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [Category]
    }).then(restaurant => {
      if (!restaurant) throw new Error('restaurant not found')

      restaurant.update({ viewCounts: restaurant.viewCounts + 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
      .catch(error => next(error))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) throw new Error('restaurant not found')
        return res.render('dashboard', { restaurant: restaurant.toJSON() })
      })
      .catch(error => next(error))
  }
}
module.exports = restaurantController
