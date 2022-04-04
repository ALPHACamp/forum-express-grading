const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    const categoryId = Number(req.query.categoryId) || ''
    return Promise.all([
      Restaurant.findAll({
        include: Category,
        where: {
          ...categoryId ? { categoryId } : {}
        },
        nest: true,
        raw: true
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
      .catch(err => next(err))
  },

  getRestaurant: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, {
        include: Category
      })
      if (!restaurant) throw new Error('Restaurant didn\'t exist!')
      let viewCounts = restaurant.viewCounts
      viewCounts += 1
      await restaurant.update({
        viewCounts
      })
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      next(err)
    }
  },

  getDashboard: async (req, res, next) => {
    const id = req.params.id
    try {
      const restaurant = await Restaurant.findByPk(id, {
        include: Category,
        raw: true,
        nest: true
      })
      if (!restaurant) throw new Error('Restaurant didn\'t exist!')
      res.render('dashboard', { restaurant })
    } catch (err) {
      next(err)
    }
  }
}
module.exports = restaurantController
