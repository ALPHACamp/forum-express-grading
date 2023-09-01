const { Restaurant, Category } = require('../models')
const restaurantController = {
  getRestaurants: (req, res) => {
    const categoryId = Number(req.query.categoryId)|| ''
    const where = {}
    if (categoryId){where.categoryId =categoryId}
    Promise.all([
      Restaurant.findAll({
        include: Category,
        where,
        nest: true,
        raw: true
      }),
      Category.findAll({raw:true})
    ])
   .then(([restaurants,categories]) => {
      const data = restaurants.map(r => ({
        ...r,
        description: r.description.substring(0, 50)
      }))
      return res.render('restaurants', {
        restaurants: data, categories, categoryId
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: false
    })
    .then(restaurant => {
      if (!restaurant) throw new Error("Restaurant didn't exist!")
      restaurant.increment('viewCounts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
    .catch(err => next(err))
  },
  getDashboard: (req, res, next) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category,
      nest: true,
      raw: false
    })
      .then(restaurant => {
        if (!restaurant) throw new Error("Restaurant didn't exist!")
        res.render('dashboard', {
          restaurant:restaurant.toJSON()
        })
      })
      .catch(err => next(err))
  }
}
module.exports = restaurantController
