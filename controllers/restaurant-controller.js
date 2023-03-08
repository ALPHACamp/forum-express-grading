const { Restaurant, Category } = require('../models')

const restaurantsController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''

    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        raw: true,
        nest: true
      }),
      Category.findAll({ raw: true })
    ])

      .then(([restaurants, categories]) => {
        const data = restaurants.map(r => ({
          ...r,
          description: r.description.substring(0, 50)
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
    Restaurant.findByPk(req.params.id, {
      include: Category
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return restaurant.increment('viewCounts')
      })
      .then(restaurant =>
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      )
      .catch(error => next(error))
  },

  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      raw: true,
      nest: true
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant doesn't exist!")
        return res.render('dashboard', { restaurant })
      })
      .catch(error => next(error))
  }
}

module.exports = restaurantsController
